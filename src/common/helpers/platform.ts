export function getPlatform(): string {
  if (process.platform === 'darwin') return 'mac'
  else if (process.platform === 'linux') return 'linux'
  else if (process.platform.startsWith('win')) return 'windows'
  else return process.platform
}

export function isMac(): boolean {
  return getPlatform() === 'mac'
}

export function isWindows(): boolean {
  return getPlatform() === 'windows'
}

export function isLinux(): boolean {
  return getPlatform() === 'linux'
}