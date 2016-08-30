import { app, BrowserWindow, Menu } from 'electron'
import { initMenu } from './menu'
import { get, set, initSettings } from './repositories/settingsRepository'
const isDev = require('electron-is-dev')

const app_dir = __dirname

// Keep a global reference of the window object (otherwise the window will
// be closed automatically when the JavaScript object is garbage collected).
let mainWindow

if (isDev) {
  require('electron-reload')(app_dir)
}

async function createWindow() {
  initSettings()

  if (isDev) {
    await set('knex.connection.filename', './bills.sqlite')
  }

  initMenu()
  mainWindow = new BrowserWindow({ width: 1200, height: 800 })
  mainWindow.loadURL(`file://${app_dir}/index.html`)

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})