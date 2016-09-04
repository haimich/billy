import { app, BrowserWindow, ipcMain } from 'electron'
import { isDev, getAppFolder } from './helpers/app'

// Keep a global reference of the window objects to prevent gc
let mainWindow, onboardingWindow, importWindow

export function openOnboardingWindow() {
  onboardingWindow = new BrowserWindow({ width: 370, height: 380 })
  onboardingWindow.loadURL(`file://${getAppFolder()}/onboarding.html`)

  ipcMain.on('onboarding-finished', () => {
    openMainWindow()
    onboardingWindow.close()
  })

  onboardingWindow.on('closed', () => {
    onboardingWindow = null
  })
}

export function openMainWindow() {
  mainWindow = new BrowserWindow({ width: 1200, height: 800 })
  mainWindow.loadURL(`file://${getAppFolder()}/main.html`)

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

export function openImportWindow() {
  importWindow = new BrowserWindow({ width: 370, height: 250 })
  importWindow.loadURL(`file://${getAppFolder()}/import.html`)

  ipcMain.on('import-finished', () => {
    importWindow.close()
  })

  importWindow.on('closed', () => {
    importWindow = null
  })
}

export function allWindowsClosed() {
  return (mainWindow === null && onboardingWindow === null && importWindow === null)
}

export function reload(focusedWindow) {
  if (focusedWindow) {
    // on reload, start fresh and close any old
    // open secondary windows
    if (focusedWindow.id === 1) {
      BrowserWindow.getAllWindows().forEach((win) => {
        if (win.id > 1) {
          win.close()
        }
      })
    }
    focusedWindow.reload()
  }
}

export function toggleDevTools(focusedWindow) {
  if (focusedWindow) {
    focusedWindow.toggleDevTools()
  }
}