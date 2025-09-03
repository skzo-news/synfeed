// Safe bridge for later APIs
const { contextBridge } = require('electron');
contextBridge.exposeInMainWorld('electron', {});
