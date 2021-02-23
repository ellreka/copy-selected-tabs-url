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
    chrome.tabs.query({ currentWindow: true }, function (tabs) {
      const sortedTabs = tabs.sort(
        (a, b) => Number(b.highlighted) - Number(a.highlighted)
      )
      setTabs(sortedTabs)
    })
  }

  function copyUrl() {
    let clipboardText = ''
    tabs.forEach((tab) => {
      clipboardText += `${tab.url}\n`
    })
    navigator.clipboard.writeText(clipboardText)
    setCopied(true)
  }

  function moveTab(id: number) {
    chrome.tabs.move(id, { index: -1 })
  }
  return (
    <div>
      <ul>
        {tabs.map((tab) => (
          <li key={tab.id}>
            <label>
              <input type="checkbox" name="" id="" checked={tab.highlighted} />
              <div>
                <img src={tab.favIconUrl} alt="" />
                <span>
                  {tab.title} | {tab.url}
                </span>
              </div>
            </label>
          </li>
        ))}
      </ul>
      <button onClick={copyUrl}>{copied ? 'copied!' : 'copy'}</button>
    </div>
  )
}

ReactDOM.render(<Popup />, document.querySelector('#root'))
