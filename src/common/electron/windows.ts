import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron'
import { isDev, getAppFolder } from '../helpers/app'
const electronLocalshortcut = require('electron-localshortcut')

// Keep a global reference of the window objects to prevent gc
let mainWindow, onboardingWindow, importWindow, statsWindow, summaryWindow

const webPreferences = {
  nodeIntegration: true,
  enableRemoteModule: true,
}

export function openOnboardingWindow() {
  console.log('open onboarding window')

  onboardingWindow = new BrowserWindow({
    width: 450,
    height: 320,
    show: false,
    resizable: false,
    titleBarStyle: 'hidden',
    type: 'splash',
    webPreferences,
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

export function openMainWindow() {
  console.log('open main window')

  mainWindow = new BrowserWindow({
    width: 1200,
    height: isDev ? 900 : 720, // create room for dev tools
    show: false,
    webPreferences,
  })
  mainWindow.loadURL(`file://${getAppFolder()}/src/main.html`)

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.once('ready-to-show', () => {
    useShortcut('CommandOrControl+D', mainWindow)
    
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('closed', () => {
    unregisterShortcuts(mainWindow)
    mainWindow = null
  })
}

export function openImportWindow() {
  console.log('open import window')

  importWindow = new BrowserWindow({
    width: 380,
    height: 260,
    show: false,
    webPreferences,
  })
  importWindow.loadURL(`file://${getAppFolder()}/src/import.html`)

  importWindow.once('ready-to-show', () => {
    useShortcut('CommandOrControl+D', mainWindow)

    importWindow.show()
  })

  ipcMain.on('import-finished', () => {
    importWindow.close()
  })

  importWindow.on('closed', () => {
    importWindow = null
  })
}

export function openStatsWindow() {
  console.log('open stats window')

  statsWindow = new BrowserWindow({
    width: 790,
    height: 880,
    show: false,
    webPreferences,
  })
  statsWindow.loadURL(`file://${getAppFolder()}/src/stats.html`)

  statsWindow.once('ready-to-show', () => {
    useShortcut('CommandOrControl+D', statsWindow)

    statsWindow.show()
  })

  statsWindow.on('closed', () => {
    unregisterShortcuts(statsWindow)
    statsWindow = null
  })
}

export function openSummaryWindow() {
  console.log('open summary window')

  summaryWindow = new BrowserWindow({
    width: 1200,
    height: isDev ? 900 : 710, // create room for dev tools
    show: false,
    webPreferences,
  })
  summaryWindow.loadURL(`file://${getAppFolder()}/src/summary.html`)

  summaryWindow.once('ready-to-show', () => {
    summaryWindow.show()
  })

  summaryWindow.on('closed', () => {
    summaryWindow = null
  })
}

export function allWindowsClosed() {
  return (mainWindow == null && onboardingWindow == null && importWindow == null && summaryWindow == null)
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

function useShortcut(shortcut: string, window: any) {
  electronLocalshortcut.register(window, shortcut, () => {
    if (window != null) {
      window['webContents'].send(`shortcut-${shortcut}`)
    }
  })
}

function unregisterShortcuts(window) {
  electronLocalshortcut.unregisterAll(window)
}