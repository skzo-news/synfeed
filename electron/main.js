import { app, BrowserWindow, ipcMain, shell, session, dialog } from 'electron'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import Parser from 'rss-parser'
import { autoUpdater } from 'electron-updater'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let win

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#0b0f14',
    titleBarStyle: 'hiddenInset',
    icon: join(__dirname, '../buildResources/icon.png'),
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: true
    }
  })

  const isDev = !app.isPackaged
  if (isDev) {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools({ mode: 'detach' })
  } else {
    win.loadFile(join(__dirname, '../dist/index.html'))
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

function initAutoUpdate() {
  autoUpdater.autoDownload = true
  autoUpdater.on('update-available', () => {
    if (win) win.webContents.send('update-status', 'Update available, downloading…')
  })
  autoUpdater.on('update-downloaded', () => {
    if (!win) return
    const choice = dialog.showMessageBoxSync(win, {
      type: 'question',
      buttons: ['Install and Relaunch', 'Later'],
      defaultId: 0,
      message: 'A new version of SynFeed has been downloaded. Install now?'
    })
    if (choice === 0) autoUpdater.quitAndInstall()
  })
  autoUpdater.on('error', (e) => {
    if (win) win.webContents.send('update-status', `Updater error: ${e?.message || e}`)
  })
  autoUpdater.checkForUpdatesAndNotify()
}

app.whenReady().then(async () => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const csp = "default-src 'self' 'unsafe-inline' data: blob: filesystem: http: https:; media-src * blob: data:; img-src * data:; frame-src https: http:;"
    callback({ responseHeaders: { ...details.responseHeaders, 'Content-Security-Policy': [csp] } })
  })
  createWindow()
  initAutoUpdate()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('fetch-feeds', async (_evt, sources) => {
  const parser = new Parser()
  const results = []
  for (const src of sources) {
    try {
      const feed = await parser.parseURL(src.url)
      for (const item of feed.items.slice(0, 20)) {
        results.push({
          source: src.name,
          category: src.category,
          title: item.title || '',
          link: item.link || '',
          isoDate: item.isoDate || item.pubDate || '',
          contentSnippet: item.contentSnippet || '',
          content: item['content:encoded'] || item.content || '',
        })
      }
    } catch (e) {
      results.push({
        source: src.name,
        category: src.category,
        title: `⚠️ Failed to read feed: ${src.url}`,
        link: '',
        isoDate: new Date().toISOString(),
        contentSnippet: String(e?.message || e),
        content: ''
      })
    }
  }
  results.sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate))
  return results
})
