import { app } from 'electron'
import { initMenu } from './common/menu'
import { userInputNeeded } from './common/providers/settingsProvider'
import { isMac } from './common/helpers/platform'
import { openMainWindow, openOnboardingWindow, openStatsWindow, allWindowsClosed } from './common/windows'
import { isDev, getAppFolder } from './common/helpers/app'

if (isDev) {
  require('electron-reload')(getAppFolder())
}

async function createWindow() {
  try {
    initMenu()

    if (await userInputNeeded()) {
      openOnboardingWindow()
    } else {
      openMainWindow()
    }
  } catch (err) {
    console.error('An error occured in createWindow', err)
    process.exit(1)
  }
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (! isMac()) {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (allWindowsClosed()) {
    createWindow()
  }
})