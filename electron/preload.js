// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  fetchFeed: (url) => ipcRenderer.invoke('feeds:fetch', url),
  openExternal: (url) => ipcRenderer.invoke('shell:openExternal', url),
});

contextBridge.exposeInMainWorld('updater', {
  check: () => ipcRenderer.invoke('updater:check'),
  onStatus: (fn) => ipcRenderer.on('updater:status', (_e, data) => fn(data)),
  onProgress: (fn) => ipcRenderer.on('updater:progress', (_e, data) => fn(data)),
});
