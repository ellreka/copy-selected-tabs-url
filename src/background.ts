import 'crx-hotreload'

chrome.runtime.onInstalled.addListener(function () {
  console.log('installed')
})
