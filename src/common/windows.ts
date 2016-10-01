import { app, BrowserWindow, ipcMain } from 'electron'
import { isDev, getAppFolder } from './helpers/app'
import { get, set } from './providers/settingsProvider'
import WindowModel from './models/WindowModel'

// Keep a global reference of the window objects to prevent gc
let mainWindow, onboardingWindow, importWindow

export function openOnboardingWindow() {
  onboardingWindow = new BrowserWindow({
    width: 450,
    height: 320,
    show: false,
    resizable: false,
    titleBarStyle: 'hidden',
    type: 'splash'
  })
  onboardingWindow.loadURL(`file://${getAppFolder()}/src/onboarding.html`)

  onboardingWindow.once('ready-to-show', () => {
    onboardingWindow.show()
  })

  ipcMain.on('onboarding-finished', () => {
    openMainWindow()
    onboardingWindow.close()
  })

  onboardingWindow.on('closed', () => {
    onboardingWindow = null
  })
}

export async function openMainWindow() {
  const dimensions = await getDimensions('main')

  mainWindow = new BrowserWindow({
    width: dimensions.width,
    height: dimensions.height,
    show: false
  })
  mainWindow.loadURL(`file://${getAppFolder()}/src/main.html`)

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

export function openImportWindow() {
  importWindow = new BrowserWindow({
    width: 380,
    height: 260,
    show: false
  })
  importWindow.loadURL(`file://${getAppFolder()}/src/import.html`)

  importWindow.once('ready-to-show', () => {
    importWindow.show()
  })

  ipcMain.on('import-finished', () => {
    importWindow.close()
  })

  importWindow.on('closed', () => {
    importWindow = null
  })
}

export function allWindowsClosed() {
  return (mainWindow == null && onboardingWindow == null && importWindow == null)
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

async function getDimensions(windowName: string): Promise<WindowModel> {
  let windowSettings, dimensions

  try {
    windowSettings = await get('windowSettings')
  } catch (err) {
    console.error('Error while fetching window settings', err)
  }

  if (windowSettings != null) {
    dimensions.width = windowSettings.width
    dimensions.height = windowSettings.height
  } else {
    switch (windowName) {
      case 'main':
        dimensions.width = 1200
        dimensions.height = 800
        break
      case 'default':
        dimensions.width = 1200
        dimensions.height = 800
    }
  }

  return dimensions
}