import React from 'react'
import ReactDOM from 'react-dom'

export function Popup() {
  const [tabs, setTabs] = React.useState<chrome.tabs.Tab[]>([])
  const [copied, setCopied] = React.useState<boolean>(false)

  React.useEffect(() => {
    getSelectedTabs()
  }, [])

  React.useEffect(() => {
    if (!copied) return
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }, [copied])

  function getSelectedTabs() {
    chrome.tabs.query(
      { highlighted: true, currentWindow: true },
      function (tabs) {
        setTabs(tabs)
      }
    )
  }

  function copyUrl() {
    let clipboardText = ''
    tabs.forEach((tab) => {
      clipboardText += `${tab.url}\n`
    })
    navigator.clipboard.writeText(clipboardText)
    setCopied(true)
  }
  return (
    <div>
      <ul>
        {tabs.map((tab) => (
          <li key={tab.index}>
            <a href={tab.url} target="_blank">
              {tab.url}
            </a>
          </li>
        ))}
      </ul>
      <button onClick={copyUrl}>{copied ? 'copied!' : 'copy'}</button>
    </div>
  )
}

ReactDOM.render(<Popup />, document.querySelector('#root'))
