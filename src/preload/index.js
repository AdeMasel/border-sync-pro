const { contextBridge, ipcRenderer } = require('electron')

// Bridge sicuro tra renderer e processo principale
contextBridge.exposeInMainWorld('electronAPI', {
  // Dialog e file system
  openAudio: () => ipcRenderer.invoke('dialog:openAudio'),
  openProject: () => ipcRenderer.invoke('dialog:openProject'),
  saveProject: (data) => ipcRenderer.invoke('dialog:saveProject', data),
  exportFile: (opts) => ipcRenderer.invoke('dialog:exportFile', opts),
  readAudio: (filePath) => ipcRenderer.invoke('file:readAudio', filePath),

  // Store persistente
  storeGet: (key) => ipcRenderer.invoke('store:get', key),
  storeSet: (key, value) => ipcRenderer.invoke('store:set', key, value),
  storeDelete: (key) => ipcRenderer.invoke('store:delete', key),

  // Listener per eventi da menu nativo
  onMenuAction: (callback) => {
    const events = [
      'menu:new', 'menu:open', 'menu:save', 'menu:saveAs',
      'menu:exportLRC', 'menu:exportSRT', 'menu:exportJSON',
      'menu:undo', 'menu:redo', 'menu:playPause',
      'menu:tap', 'menu:nudgeForward', 'menu:nudgeBack'
    ]
    events.forEach(event => {
      ipcRenderer.on(event, (_, ...args) => callback(event, ...args))
    })
  },

  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),

  // Info piattaforma
  platform: process.platform
})
