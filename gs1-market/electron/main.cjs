// Proceso principal de Electron. Sin internet: carga la app compilada (dist/).
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const fs = require('node:fs');
const path = require('node:path');

const dataFile = () => path.join(app.getPath('userData'), 'gs1-market-data.json');

ipcMain.handle('store:load', () => {
  try {
    return JSON.parse(fs.readFileSync(dataFile(), 'utf8'));
  } catch {
    return null; // primera vez o archivo dañado: la app arranca vacía
  }
});

ipcMain.handle('store:save', (_event, data) => {
  // Escritura atómica: se escribe un temporal y se renombra, así un corte de luz no deja el archivo a medias
  const tmp = `${dataFile()}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, dataFile());
  return true;
});

// Solo una instancia a la vez (evita abrir dos ventanas con la misma pistola)
if (!app.requestSingleInstanceLock()) {
  app.quit();
}

let win;

function createWindow() {
  win = new BrowserWindow({
    title: 'GS1 Market - La Carrera de Escaneo',
    fullscreen: !process.env.GS1_WINDOWED, // pantalla completa para la TV
    autoHideMenuBar: true,
    backgroundColor: '#FFFFFF',
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      devTools: !app.isPackaged,
    },
  });
  win.removeMenu();
  win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));

  // F11 alterna pantalla completa; Ctrl+Q cierra la app
  win.webContents.on('before-input-event', (event, input) => {
    if (input.type !== 'keyDown') return;
    if (input.key === 'F11') {
      win.setFullScreen(!win.isFullScreen());
      event.preventDefault();
    } else if (input.control && input.key.toLowerCase() === 'q') {
      app.quit();
    }
  });

  // La app no navega a ningún sitio externo
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/.test(url)) void shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (event) => event.preventDefault());
}

app.whenReady().then(createWindow);
app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});
app.on('window-all-closed', () => app.quit());
