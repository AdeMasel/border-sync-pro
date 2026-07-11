# Border Sync Pro

Professional LRC lyrics synchronization desktop app built with Electron.

## Features

- **Manual sync**: Tap timing and nudge controls
- **AI sync**: Gemini-powered automatic synchronization
- **Audio playback**: Local files and YouTube support
- **Export formats**: LRC, SRT, JSON
- **Quality assurance**: Built-in validation
- **Karaoke mode**: Full-screen synchronized playback
- **Professional UI**: Studio-grade interface

## Installation

Download the latest release:

### macOS Installation Issues

If you get an error when opening the app on macOS, run this command in Terminal:

```bash
xattr -cr /Applications/Border\ Sync\ Pro.app
```

This removes the quarantine attribute that macOS adds to downloaded apps.

Alternatively, you can:
1. Right-click the app and select "Open"
2. Click "Open" in the security dialog
3. Or go to System Preferences > Security & Privacy and click "Open Anyway"

- **macOS**: `.dmg` installer
- **Windows**: `.exe` installer

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run dist:mac
npm run dist:win
```

## License

MIT
