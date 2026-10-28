const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const express = require('express');
const auth = require('../middleware/auth');
const users = require('../db/user');

const uploadDirectory = process.env.UPLOAD_DIR || path.join(__dirname, '..', '..', 'uploads');
const maxPictureBytes = 2 * 1024 * 1024;
const allowedFields = new Set(['name', 'nickName', 'mobileNo', 'status']);

function isValidImage(type, bytes) {
  if (type === 'png') {
    return bytes.length >= 8
      && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  }
  if (type === 'jpeg') {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  return type === 'webp'
    && bytes.length >= 12
    && bytes.toString('ascii', 0, 4) === 'RIFF'
    && bytes.toString('ascii', 8, 12) === 'WEBP';
}

function removeStoredPicture(profilePicturePath) {
  if (!profilePicturePath || !profilePicturePath.startsWith('/uploads/')) return;
  const filename = path.basename(profilePicturePath);
  if (!filename || filename !== profilePicturePath.slice('/uploads/'.length)) return;
  const filePath = path.join(uploadDirectory, filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

class ProfileRoutes {
  constructor() {
    this.router = express.Router();
    this.router.use(auth.authenticate);
    this.router.get('/', this.get.bind(this));
    this.router.patch('/', this.update.bind(this));
    this.router.post('/picture', this.uploadPicture.bind(this));
    this.router.delete('/picture', this.clearPicture.bind(this));
  }

  get(req, res) {
    const profile = users.getProfileBySID(req.user.userSID);
    if (!profile) return res.status(404).json({ error: 'User not found' });
    return res.json({ profile });
  }

  update(req, res) {
    if (!users.getProfileBySID(req.user.userSID)) {
      return res.status(404).json({ error: 'User not found' });
    }

    const body = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return res.status(400).json({ error: 'A profile object is required' });
    }

    const fields = Object.keys(body);
    if (fields.some((field) => !allowedFields.has(field))) {
      return res.status(400).json({ error: 'One or more profile fields cannot be changed' });
    }
    if (fields.length === 0) {
      return res.status(400).json({ error: 'At least one profile field is required' });
    }

    const profile = {};
    for (const field of fields) {
      const value = body[field];
      if (typeof value !== 'string') {
        return res.status(400).json({ error: `${field} must be a string` });
      }

      const trimmed = value.trim();
      const maxLength = field === 'status' ? 139 : field === 'mobileNo' ? 30 : field === 'nickName' ? 32 : 80;
      if (trimmed.length > maxLength) {
        return res.status(400).json({ error: `${field} must be ${maxLength} characters or fewer` });
      }
      if (field !== 'status' && !trimmed) {
        return res.status(400).json({ error: `${field} cannot be empty` });
      }
      profile[field] = trimmed || null;
    }

    try {
      const updatedProfile = users.updateProfile(req.user.userSID, profile);
      return res.json({ profile: updatedProfile });
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(409).json({ error: 'Name or nickname is already in use' });
      }
      throw error;
    }
  }

  uploadPicture(req, res) {
    const imageData = req.body && req.body.imageData;
    if (typeof imageData !== 'string') {
      return res.status(400).json({ error: 'imageData is required' });
    }

    const match = imageData.match(/^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/);
    if (!match) {
      return res.status(400).json({ error: 'Upload a PNG, JPEG, or WebP image' });
    }

    const [, type, encoded] = match;
    const bytes = Buffer.from(encoded, 'base64');
    if (bytes.length === 0 || bytes.length > maxPictureBytes) {
      return res.status(400).json({ error: 'Profile pictures must be 2 MB or smaller' });
    }
    if (!isValidImage(type, bytes)) {
      return res.status(400).json({ error: 'The uploaded file is not a valid image' });
    }

    const previousPicture = users.getProfileBySID(req.user.userSID);
    if (!previousPicture) return res.status(404).json({ error: 'User not found' });

    fs.mkdirSync(uploadDirectory, { recursive: true });
    const filename = `${crypto.randomUUID()}.${type === 'jpeg' ? 'jpg' : type}`;
    const picturePath = `/uploads/${filename}`;
    const destination = path.join(uploadDirectory, filename);
    fs.writeFileSync(destination, bytes, { flag: 'wx' });

    try {
      const profile = users.updateProfilePicture(req.user.userSID, picturePath);
      removeStoredPicture(previousPicture && previousPicture.profilePicturePath);
      return res.json({ profile });
    } catch (error) {
      fs.unlinkSync(destination);
      throw error;
    }
  }

  clearPicture(req, res) {
    const previousProfile = users.getProfileBySID(req.user.userSID);
    if (!previousProfile) return res.status(404).json({ error: 'User not found' });

    const profile = users.updateProfilePicture(req.user.userSID, null);
    removeStoredPicture(previousProfile.profilePicturePath);
    return res.json({ profile });
  }
}

module.exports = new ProfileRoutes().router;
