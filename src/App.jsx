import React, { useEffect, useMemo, useState } from 'react'
import TabBar from './components/TabBar.jsx'
import FeedList from './components/FeedList.jsx'
import VideoPane from './components/VideoPane.jsx'
import { SOURCES } from './lib/sources.js'
export default function App() {
  const [activeTab, setActiveTab] = useState('All')
  const [feedItems, setFeedItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [updateMsg, setUpdateMsg] = useState('')
  useEffect(() => {
    async function go() {
      setLoading(true)
      try {
        const items = await window.api.fetchFeeds(SOURCES)
        setFeedItems(items)
        window.api.onUpdateStatus((msg) => setUpdateMsg(msg))
      } finally {
        setLoading(false)
      }
    }
    go()
  }, [])
  const filtered = useMemo(() => {
    if (activeTab === 'All') return feedItems
    return feedItems.filter(i => i.category === activeTab || i.source.toLowerCase().includes(activeTab.toLowerCase()))
  }, [activeTab, feedItems])
  return (
    <div className="h-screen w-screen p-3 scanline relative">
      <header className="flex items-center justify-between mb-3">
        <div className="font-mono text-lg">
          <span className="noir-glow glitch" data-text="SynFeed">SynFeed</span>
          <span className="text-cyber-text/50 ml-2 text-sm">— Tech • AI • Security</span>
        </div>
        <div className="text-xs text-cyber-text/60 font-mono">{updateMsg || 'Bias-aware • Local parsing • Auto-update enabled'}</div>
      </header>
      <div className="grid grid-cols-12 gap-3 h-[calc(100vh-70px)]">
        <div className="col-span-8 flex flex-col">
          <TabBar active={activeTab} onChange={setActiveTab} />
          <div className="mt-3 overflow-auto pr-1">
            {loading ? (
              <div className="p-6 text-cyber-text/60 font-mono">Fetching feeds…</div>
            ) : (
              <FeedList items={filtered} onPickVideo={setVideoUrl} />
            )}
          </div>
        </div>
        <div className="col-span-4">
          <VideoPane url={videoUrl} />
        </div>
      </div>
    </div>
  )
}
