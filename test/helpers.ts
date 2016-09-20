import * as jsdom from 'jsdom'

export function prepareDom() {
  const doc = jsdom.jsdom('<!doctype html><html><body></body></html>')
  global['document'] = doc
  global['window'] = doc.defaultView
  global['getComputedStyle'] = global['window'].getComputedStyle // fix for BootstrapTable
}