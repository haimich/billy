import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron'
import { isDev, getAppFolder } from '../helpers/app'

// Keep a global reference of the window objects to prevent gc
let mainWindow, onboardingWindow, importWindow, statsWindow, incomeWindow

export function openOnboardingWindow() {
  console.log('open onboarding window')

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

export function openMainWindow() {
  console.log('open main window')

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 720, // create room for dev tools
    show: false
  })
  mainWindow.loadURL(`file://${getAppFolder()}/src/main.html`)

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.once('ready-to-show', () => {
    useShortcut('CommandOrControl+d', mainWindow)

    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

export function openImportWindow() {
  console.log('open import window')

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

export function openStatsWindow() {
  console.log('open stats window')

  statsWindow = new BrowserWindow({
    width: 790,
    height: 880,
    show: false
  })
  statsWindow.loadURL(`file://${getAppFolder()}/src/stats.html`)

  statsWindow.once('ready-to-show', () => {
    statsWindow.show()
  })

  statsWindow.on('closed', () => {
    statsWindow = null
  })
}

export function openIncomeWindow() {
  console.log('open income window')

  incomeWindow = new BrowserWindow({
    width: 1200,
    height: isDev ? 900 : 710, // create room for dev tools
    show: false
  })
  incomeWindow.loadURL(`file://${getAppFolder()}/src/income.html`)

  incomeWindow.once('ready-to-show', () => {
    incomeWindow.show()
  })

  incomeWindow.on('closed', () => {
    incomeWindow = null
  })
}

export function allWindowsClosed() {
  return (mainWindow == null && onboardingWindow == null && importWindow == null && incomeWindow == null)
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
  globalShortcut.register(shortcut, () => {
    window['webContents'].send(`shortcut-${shortcut}`)
  })
}