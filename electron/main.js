// electron/main.js
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const log = require('electron-log').default;
const { autoUpdater } = require('electron-updater');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1000,
    minHeight: 700,
    backgroundColor: '#0b0e13',
    icon: path.join(__dirname, '..', 'build', 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const devUrl = process.env.VITE_DEV_SERVER_URL;
  if (!app.isPackaged && devUrl) {
    win.loadURL(devUrl);            // dev (Vite server)
    // win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html')); // prod
  }
}

/* ---------------- Updater wiring ---------------- */
function sendAll(channel, payload) {
  for (const w of BrowserWindow.getAllWindows()) {
    w.webContents.send(channel, payload);
  }
}

function setupAutoUpdater() {
  autoUpdater.logger = log;
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  // Events -> renderer (for status banner)
  autoUpdater.on('checking-for-update', () => sendAll('updater:status', { state: 'checking' }));
  autoUpdater.on('update-available', info => sendAll('updater:status', { state: 'available', info }));
  autoUpdater.on('update-not-available', () => sendAll('updater:status', { state: 'idle' }));
  autoUpdater.on('download-progress', p => sendAll('updater:progress', p));
  autoUpdater.on('update-downloaded', info => {
    sendAll('updater:status', { state: 'downloaded', info });
    // Install as soon as we can
    setTimeout(() => autoUpdater.quitAndInstall(), 800);
  });
  autoUpdater.on('error', err => sendAll('updater:status', { state: 'error', message: String(err?.message || err) }));

  // Manual trigger from renderer
  ipcMain.handle('updater:check', async () => {
    try {
      await autoUpdater.checkForUpdates();
      return { ok: true };
    } catch (e) {
      log.error(e);
      return { ok: false, error: String(e?.message || e) };
    }
  });

  // Kick off a check shortly after app starts
  setTimeout(() => autoUpdater.checkForUpdatesAndNotify(), 3000);
}

/* ---------------- Secure IPC for feeds ---------------- */
ipcMain.handle('feeds:fetch', async (_evt, url) => {
  const res = await fetch(url, {
    headers: {
      'user-agent': 'SynFeed/1.0 (+desktop)',
      'accept': 'application/rss+xml, application/xml, text/xml, */*'
    }
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, text };
});

ipcMain.handle('shell:openExternal', (_evt, url) => shell.openExternal(url));

/* ---------------- App lifecycle ---------------- */
app.whenReady().then(() => {
  createWindow();
  setupAutoUpdater();
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit();
