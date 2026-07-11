const { app, BrowserWindow, ipcMain, dialog, Menu, shell, globalShortcut } = require('electron')
const path = require('path')
const fs = require('fs')
const log = require('electron-log')

const isDev = process.env.NODE_ENV === 'development'
let mainWindow
function createWindow() {
  
mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,Height: 600,
    backgroundColor: '#0a0a0f',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    },
    icon: path.join(__dirname, '../../assets/icon.png')
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'))
  }

  mainWindow.on('closed', () => { mainWindow = null })
  buildMenu()
}

function buildMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        { label: 'Nuovo Progetto', accelerator: 'CmdOrCtrl+N', click: () => mainWindow.webContents.send('menu:new') },
        { label: 'Apri Progetto...', accelerator: 'CmdOrCtrl+O', click: () => mainWindow.webContents.send('menu:open') },
        { label: 'Salva', accelerator: 'CmdOrCtrl+S', click: () => mainWindow.webContents.send('menu:save') },
        { label: 'Salva con nome...', accelerator: 'CmdOrCtrl+Shift+S', click: () => mainWindow.webContents.send('menu:saveAs') },
        { type: 'separator' },
        { label: 'Esporta LRC...', click: () => mainWindow.webContents.send('menu:exportLRC') },
        { label: 'Esporta SRT...', click: () => mainWindow.webContents.send('menu:exportSRT') },
        { label: 'Esporta JSON...', click: () => mainWindow.webContents.send('menu:exportJSON') },
        { type: 'separator' },
        { role: 'quit', label: 'Esci' }
      ]
    },
    {
      label: 'Modifica',
      submenu: [
        { label: 'Annulla', accelerator: 'CmdOrCtrl+Z', click: () => mainWindow.webContents.send('menu:undo') },
        { label: 'Ripristina', accelerator: 'CmdOrCtrl+Shift+Z', click: () => mainWindow.webContents.send('menu:redo') },
        { type: 'separator' },
        { role: 'cut' }, { role: 'copy' }, { role: 'paste' }
      ]
    },
    {
      label: 'Riproduzione',
      submenu: [
        { label: 'Play / Pausa', accelerator: 'Space', click: () => mainWindow.webContents.send('menu:playPause') },
        { label: 'Tap Timestamp', accelerator: 'CmdOrCtrl+T', click: () => mainWindow.webContents.send('menu:tap') },
        { label: 'Nudge +100ms', accelerator: 'CmdOrCtrl+Right', click: () => mainWindow.webContents.send('menu:nudgeForward') },
        { label: 'Nudge -100ms', accelerator: 'CmdOrCtrl+Left', click: () => mainWindow.webContents.send('menu:nudgeBack') }
      ]
    },
    {
      label: 'Visualizza',
      submenu: [
        { role: 'reload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    template.unshift({ label: app.name, submenu: [{ role: 'about' }, { type: 'separator' }, { role: 'hide' }, { role: 'quit' }] })
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

// IPC handlers
ipcMain.handle('dialog:openAudio', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Apri file audio',
    filters: [{ name: 'Audio', extensions: ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac'] }],
    properties: ['openFile']
  })
  return result.canceled ? null : result.filePaths[0]
})

ipcMain.handle('dialog:openProject', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Apri progetto Border Sync Pro',
    filters: [{ name: 'Border Sync Pro', extensions: ['bsp', 'json'] }],
    properties: ['openFile']
  })
  if (result.canceled) return null
  try {
    return JSON.parse(fs.readFileSync(result.filePaths[0], 'utf-8'))
  } catch (e) { return null }
})

ipcMain.handle('dialog:saveProject', async (_, data) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Salva progetto',
    defaultPath: `${data.title || 'progetto'}.bsp`,
    filters: [{ name: 'Border Sync Pro', extensions: ['bsp'] }]
  })
  if (result.canceled) return false
  fs.writeFileSync(result.filePath, JSON.stringify(data, null, 2))
  return true
})

ipcMain.handle('dialog:exportFile', async (_, { content, defaultName, ext, mimeType }) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: defaultName,
    filters: [{ name: ext.toUpperCase(), extensions: [ext] }]
  })
  if (result.canceled) return false
  fs.writeFileSync(result.filePath, content, 'utf-8')
  return true
})

ipcMain.handle('file:readAudio', async (_, filePath) => {
  if (!fs.existsSync(filePath)) return null
  const buffer = fs.readFileSync(filePath)
  return buffer.toString('base64')
})

ipcMain.handle('store:get', (_, key) => store.get(key))
ipcMain.handle('store:set', (_, key, value) => store.set(key, value))
ipcMain.handle('store:delete', (_, key) => store.delete(key))

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
})

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })

log.info('Border Sync Pro started', app.getVersion())
