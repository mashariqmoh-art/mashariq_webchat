import React from 'react';
import api from '../shared/api';
import './ProfileDialog.css';

class ProfileDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.profile ? props.profile.name : '',
      nickName: props.profile ? props.profile.nickName : '',
      mobileNo: props.profile ? props.profile.mobileNo : '',
      status: props.profile ? props.profile.status || '' : '',
      saving: false,
      uploading: false,
      error: props.error || null,
    };
  }

  componentDidUpdate(previousProps) {
    if (previousProps.profile !== this.props.profile && this.props.profile) {
      this.setState({
        name: this.props.profile.name,
        nickName: this.props.profile.nickName,
        mobileNo: this.props.profile.mobileNo,
        status: this.props.profile.status || '',
      });
    }
    if (previousProps.error !== this.props.error && this.props.error) {
      this.setState({ error: this.props.error });
    } else if (previousProps.error && !this.props.error) {
      this.setState({ error: null });
    }
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value, error: null });
  };

  saveProfile = async (event) => {
    event.preventDefault();
    this.setState({ saving: true, error: null });
    try {
      const { profile } = await api.patch('/api/profile', {
        name: this.state.name,
        nickName: this.state.nickName,
        mobileNo: this.state.mobileNo,
        status: this.state.status,
      });
      this.props.onProfileUpdated(profile);
      this.setState({ saving: false });
    } catch (error) {
      this.setState({ saving: false, error: error.message });
    }
  };

  uploadPicture = (event) => {
    const file = event.target.files && event.target.files[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      this.setState({ error: 'Choose a PNG, JPEG, or WebP image.' });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      this.setState({ error: 'Profile pictures must be 2 MB or smaller.' });
      return;
    }

    this.setState({ uploading: true, error: null });
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const { profile } = await api.post('/api/profile/picture', { imageData: reader.result });
        this.props.onProfileUpdated(profile);
        this.setState({ uploading: false });
      } catch (error) {
        this.setState({ uploading: false, error: error.message });
      }
    };
    reader.onerror = () => this.setState({ uploading: false, error: 'Could not read the selected image.' });
    reader.readAsDataURL(file);
  };

  clearPicture = async () => {
    this.setState({ uploading: true, error: null });
    try {
      const { profile } = await api.delete('/api/profile/picture');
      this.props.onProfileUpdated(profile);
      this.setState({ uploading: false });
    } catch (error) {
      this.setState({ uploading: false, error: error.message });
    }
  };

  render() {
    const { profile, loading, onClose, onRetry, language } = this.props;
    const { name, nickName, mobileNo, status, saving, uploading, error } = this.state;
    const isArabic = language === 'ar';
    const fallback = ((profile && (profile.nickName || profile.name)) || '?')
      .trim().charAt(0).toLocaleUpperCase();

    return (
      <div className="profile-backdrop" onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving && !uploading) onClose();
      }}>
        <section
          aria-labelledby="profile-title"
          aria-modal="true"
          className="profile-dialog"
          dir={isArabic ? 'rtl' : 'ltr'}
          lang={language}
          role="dialog"
        >
          <header className="profile-dialog-header">
            <div>
              <span className="chat-section-kicker">{isArabic ? 'ملفك الشخصي' : 'YOUR ACCOUNT'}</span>
              <h2 id="profile-title">{isArabic ? 'الملف الشخصي والحالة' : 'Profile & status'}</h2>
            </div>
            <button aria-label={isArabic ? 'إغلاق' : 'Close'} className="profile-close"
              disabled={saving || uploading} onClick={onClose} type="button">×</button>
          </header>

          {loading && <p className="profile-message">{isArabic ? 'جارٍ تحميل الملف…' : 'Loading profile…'}</p>}
          {error && <div className="profile-error" role="alert">
            <span>{error}</span>
            {onRetry && <button className="profile-text-button" onClick={onRetry} type="button">
              {isArabic ? 'إعادة المحاولة' : 'Retry'}
            </button>}
          </div>}
          {!loading && profile && (
            <form className="profile-form" onSubmit={this.saveProfile}>
              <div className="profile-picture-row">
                {profile.profilePicturePath ? (
                  <img className="profile-picture" src={api.assetUrl(profile.profilePicturePath)} alt="" />
                ) : (
                  <span className="profile-picture profile-picture-fallback">{fallback}</span>
                )}
                <div className="profile-picture-actions">
                  <label className="profile-upload-button">
                    {uploading ? (isArabic ? 'جارٍ تحديث الصورة…' : 'Updating picture…')
                      : (isArabic ? 'تغيير الصورة' : 'Change picture')}
                    <input accept="image/png,image/jpeg,image/webp" disabled={uploading}
                      onChange={this.uploadPicture} type="file" />
                  </label>
                  {profile.profilePicturePath && (
                    <button className="profile-text-button" disabled={uploading}
                      onClick={this.clearPicture} type="button">
                      {isArabic ? 'إزالة' : 'Remove'}
                    </button>
                  )}
                  <small>{isArabic ? 'PNG أو JPEG أو WebP، حتى 2 ميغابايت' : 'PNG, JPEG, or WebP · up to 2 MB'}</small>
                </div>
              </div>

              <label className="profile-field">
                <span>{isArabic ? 'الاسم' : 'Name'}</span>
                <input maxLength="80" name="name" onChange={this.handleChange} required value={name} />
              </label>
              <label className="profile-field">
                <span>{isArabic ? 'البريد الإلكتروني' : 'Email'}</span>
                <input readOnly value={profile.email} />
              </label>
              <label className="profile-field">
                <span>{isArabic ? 'اسم المستخدم' : 'Nickname'}</span>
                <input maxLength="32" name="nickName" onChange={this.handleChange} required value={nickName} />
              </label>
              <label className="profile-field">
                <span>{isArabic ? 'رقم الهاتف' : 'Mobile number'}</span>
                <input maxLength="30" name="mobileNo" onChange={this.handleChange} required value={mobileNo} />
              </label>
              <label className="profile-field">
                <span>{isArabic ? 'الحالة' : 'Status'} <small>({status.length}/139)</small></span>
                <textarea maxLength="139" name="status" onChange={this.handleChange}
                  placeholder={isArabic ? 'اكتب حالة قصيرة' : 'Write a short status'} rows="2" value={status} />
              </label>

              <footer className="profile-dialog-footer">
                <button className="profile-cancel" disabled={saving || uploading} onClick={onClose} type="button">
                  {isArabic ? 'إغلاق' : 'Close'}
                </button>
                <button className="profile-save" disabled={saving || uploading} type="submit">
                  {saving ? (isArabic ? 'جارٍ الحفظ…' : 'Saving…')
                    : (isArabic ? 'حفظ التغييرات' : 'Save changes')}
                </button>
              </footer>
            </form>
          )}
        </section>
      </div>
    );
  }
}

export default ProfileDialog;
