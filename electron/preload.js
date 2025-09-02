import { contextBridge, ipcRenderer } from 'electron'
contextBridge.exposeInMainWorld('api', {
  fetchFeeds: (sources) => ipcRenderer.invoke('fetch-feeds', sources),
  onUpdateStatus: (cb) => ipcRenderer.on('update-status', (_e, msg) => cb(msg))
})
