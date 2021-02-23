import React from 'react'
import ReactDOM from 'react-dom'
import './style.css'

interface TabItem extends chrome.tabs.Tab {
  checked: boolean
}

export function Popup() {
  const [tabs, setTabs] = React.useState<TabItem[]>([])
  const [clipboardText, setClipboardText] = React.useState<string>('')
  const [copied, setCopied] = React.useState<boolean>(false)

  React.useEffect(() => {
    getCurrentWindowTabs()
  }, [])

  React.useEffect(() => {
    let text = ''
    tabs
      .filter((tab) => tab.checked)
      .forEach((tab) => {
        text += `${tab.url}\n`
      })
    setClipboardText(text)
  }, [tabs])

  React.useEffect(() => {
    if (!copied) return
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }, [copied])

  function onCheckTab(id: number | undefined) {
    setTabs(
      tabs.map((tab) => {
        return tab.id === id
          ? {
              ...tab,
              checked: !tab.checked
            }
          : tab
      })
    )
  }

  function getCurrentWindowTabs() {
    chrome.tabs.query({ currentWindow: true }, function (tabs) {
      const tabList = tabs
        .map((tab) => {
          return {
            ...tab,
            checked: tab.highlighted
          }
        })
        .sort((a, b) => Number(b.highlighted) - Number(a.highlighted))

      setTabs(tabList)
    })
  }

  function onChangeTextArea(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const { value } = event.target
    setClipboardText(value)
  }

  function copyUrl() {
    navigator.clipboard.writeText(clipboardText)
    setCopied(true)
  }

  function openTab(id: number | undefined) {
    if (id !== undefined) {
      chrome.tabs.update(id, {
        active: true
      })
    }
  }

  return (
    <div className="px-10 py-5 max-w-4xl w-screen-sm bg-gray-500 space-y-5">
      <ul className="h-64 overflow-scroll">
        {tabs.map((tab) => (
          <li key={tab.id} className="truncate">
            <label className="flex items-center space-x-2 rounded-md cursor-pointer p-2 hover:bg-gray-600">
              <input
                type="checkbox"
                onChange={() => onCheckTab(tab.id)}
                checked={tab.checked}
              />
              <div className="flex items-center space-x-2">
                <img className="w-4 h-4" src={tab.favIconUrl} alt="" />
                <span className="text-base text-white">{tab.title}</span>
                <button
                  className="w-6 h-6 rounded-md hover:bg-gray-700 flex items-center justify-center"
                  onClick={() => openTab(tab.id)}>
                  <svg
                    className="text-gray-300 w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </button>
              </div>
            </label>
          </li>
        ))}
      </ul>
      <div>
        <textarea
          className="w-full h-24"
          onChange={onChangeTextArea}
          value={clipboardText}
        />
        <button
          className="flex items-center space-x-2 text-white text-base shadow-md transition-colors bg-gray-600 hover:bg-gray-700 rounded-md px-3 py-2"
          onClick={copyUrl}>
          <svg
            className="w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
            />
          </svg>
          <span className="leading-none">{copied ? 'copied!' : 'copy'}</span>
        </button>
      </div>
    </div>
  )
}

ReactDOM.render(<Popup />, document.querySelector('#root'))
