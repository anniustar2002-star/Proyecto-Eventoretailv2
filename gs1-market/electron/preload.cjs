const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('gs1Store', {
  load: () => ipcRenderer.invoke('store:load'),
  save: (data) => ipcRenderer.invoke('store:save', data),
});
