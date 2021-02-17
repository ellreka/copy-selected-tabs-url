import React from 'react'
import ReactDOM from 'react-dom'

export function Popup() {
  const [tabs, setTabs] = React.useState<chrome.tabs.Tab[]>([])

  React.useEffect(() => {
    getSelectedTabs()
  }, [])

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
    console.log(clipboardText)
    navigator.clipboard.writeText(clipboardText);
  }
  return (
    <div>
      <ul>
        {tabs.map((tab) => (
          <li key={tab.index}>
            <a href={tab.url}>{tab.url}</a>
          </li>
        ))}
      </ul>
      <button onClick={copyUrl}>copy</button>
    </div>
  )
}

ReactDOM.render(<Popup />, document.querySelector('#root'))
