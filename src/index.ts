import { app, BrowserWindow, ipcMain } from 'electron'
import { initMenu } from './common/menu'
import { userInputNeeded } from './common/providers/settingsProvider'
import { isMac } from './common/helpers/platform'
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
    openOnboardingWindow()
  } else {
    openMainWindow()
  }
}

function openOnboardingWindow() {
  onboardingWindow = new BrowserWindow({ width: 370, height: 380 })
  onboardingWindow.loadURL(`file://${app_dir}/onboarding.html`)

  ipcMain.on('onboarding-finished', () => {
    openMainWindow()
  })

  onboardingWindow.on('closed', () => {
    onboardingWindow = null
  })
}

function openMainWindow() {
  mainWindow = new BrowserWindow({ width: 1200, height: 800 })
  mainWindow.loadURL(`file://${app_dir}/main.html`)

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
  if (isMac()) {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null && onboardingWindow === null) {
    createWindow()
  }
})