Mashariq WebChat

Contriputors:
- Hefny
- Shahad Atiah
- AbdAllah

## Build & Run (dev mode)

The commands are the same on Ubuntu and Windows — only the `cd` path differs.

### Server (Express + Socket.IO, port 3001)

```bash
# Ubuntu
cd ~/code/mashariq_webchat/server
npm install      # first time only
npm run dev      # nodemon, auto-restarts on file changes
```

```powershell
# Windows (PowerShell or CMD)
cd C:\path\to\mashariq_webchat\server
npm install      # first time only
npm run dev
```

### Website (React + Vite, port 5173)

```bash
# Ubuntu — run in a second terminal
cd ~/code/mashariq_webchat/website
npm install      # first time only
npm run dev
```

```powershell
# Windows — run in a second terminal
cd C:\path\to\mashariq_webchat\website
npm install      # first time only
npm run dev
```

### Run both at once

Ubuntu (single terminal):

```bash
cd ~/code/mashariq_webchat/server && npm run dev &
cd ~/code/mashariq_webchat/website && npm run dev
```

Windows PowerShell (opens two windows):

```powershell
Start-Process powershell -ArgumentList "-NoExit","cd C:\path\to\mashariq_webchat\server; npm run dev"
Start-Process powershell -ArgumentList "-NoExit","cd C:\path\to\mashariq_webchat\website; npm run dev"
```

### Windows notes

- If `npm` is not recognized, install Node.js LTS from https://nodejs.org
- If `better-sqlite3` fails to build during `npm install`, install Visual Studio Build Tools (Desktop C++ workload). Prebuilt binaries cover most Node versions, so this is usually not needed.