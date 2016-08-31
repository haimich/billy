import { app, BrowserWindow, Menu } from 'electron'
import { initMenu } from './common/menu'
import { initDb } from './common/repositories/billsRepository'
import { userInputNeeded } from './common/repositories/settingsRepository'
const isDev = require('electron-is-dev')

const app_dir = __dirname

if (isDev) {
  require('electron-reload')(app_dir)
}

// Keep a global reference of the window objects to prevent gc
let mainWindow, onboardingWindow

async function createWindow() {
  initMenu()

  if (await userInputNeeded()) {
    onboardingWindow = new BrowserWindow({ width: 410, height: 400 })
    onboardingWindow.loadURL(`file://${app_dir}/onboarding.html`)
    
    onboardingWindow.on('closed', () => {
      onboardingWindow = null
    })
  } else {
    mainWindow = new BrowserWindow({ width: 1200, height: 800 })
    mainWindow.loadURL(`file://${app_dir}/main.html`)

    if (isDev) {
      mainWindow.webContents.openDevTools()
    }

    mainWindow.on('closed', () => {
      mainWindow = null
    })
  }
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