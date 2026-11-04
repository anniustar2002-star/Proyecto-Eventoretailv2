// Proceso principal de Electron. Sin internet: carga la app compilada (dist/).
const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('node:fs');
const path = require('node:path');

const dataFile = () => path.join(app.getPath('userData'), 'gs1-market-data.json');

ipcMain.handle('store:load', () => {
  try {
    return JSON.parse(fs.readFileSync(dataFile(), 'utf8'));
  } catch {
    return null;
  }
});
ipcMain.handle('store:save', (_e, data) => {
  fs.writeFileSync(dataFile(), JSON.stringify(data, null, 2));
  return true;
});

function createWindow() {
  const win = new BrowserWindow({
    fullscreen: true,
    autoHideMenuBar: true,
    backgroundColor: '#FFFFFF',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
