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
  const [filterText, setFilterText] = React.useState<string>('')
  const [template, setTemplate] = React.useState<string>('{{ url }}')

  const sortedTabs = React.useMemo(() => {
    const regex = new RegExp(filterText, 'ig')
    return tabs.filter((tab) => {
      return regex.test(tab.title ?? '') || regex.test(tab.url ?? '')
    })
  }, [filterText, tabs])

  React.useEffect(() => {
    getCurrentWindowTabs()
  }, [])

  React.useEffect(() => {
    let text = ''
    tabs
      .filter((tab) => tab.checked)
      .forEach((tab) => {
        const oneLineText = template
          .replace(/{{ url }}/gi, tab.url ?? '')
          .replace(/{{ title }}/gi, tab.title ?? '')
        text += `${oneLineText}\n`
      })
    setClipboardText(text)
  }, [tabs, template])

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

  function onChangeFilterText(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target
    setFilterText(value)
  }

  function onChangeTemplate(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target
    setTemplate(value)
  }

  return (
    <div className="px-10 py-5 max-w-4xl w-screen-sm bg-gray-500 space-y-5">
      <div className="flex justify-end space-x-3">
        <label className="inline-flex items-center h-6">
          <div className="w-6 h-full bg-gray-600 rounded-l-md flex items-center justify-center">
            <svg
              className="text-white w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
              />
            </svg>
          </div>
          <input
            className="rounded-r-md h-full bg-white w-36 px-2 py-1"
            placeholder="{{ title }} | {{ url }}"
            type="text"
            value={template}
            onChange={onChangeTemplate}
          />
        </label>
        <label className="inline-flex items-center h-6">
          <div className="w-6 h-full bg-gray-600 rounded-l-md flex items-center justify-center">
            <svg
              className="text-white w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            className="rounded-r-md h-full bg-white w-36 px-2 py-1"
            type="text"
            value={filterText}
            onChange={onChangeFilterText}
          />
        </label>
      </div>
      <ul className="h-64 overflow-scroll">
        {sortedTabs.length > 0 ? (
          sortedTabs.map((tab) => (
            <li key={tab.id} className="">
              <label className="flex items-center space-x-2 rounded-md cursor-pointer p-2 hover:bg-gray-600">
                <input
                  type="checkbox"
                  onChange={() => onCheckTab(tab.id)}
                  checked={tab.checked}
                />
                <div className="flex items-center w-full overflow-x-hidden space-x-2">
                  <img className="w-4 h-4" src={tab.favIconUrl} alt="" />
                  <span
                    className="text-base text-white truncate"
                    title={tab.title}>
                    {tab.title}
                  </span>
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
          ))
        ) : (
          <p className="text-base text-white font-bold flex justify-center items-center h-full">
            Tab does not exist.
          </p>
        )}
      </ul>
      <div>
        <textarea
          className="w-full h-24 whitespace-nowrap"
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
