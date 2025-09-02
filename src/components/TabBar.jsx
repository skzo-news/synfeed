import React from 'react'
import { Newspaper, Bot, Shield, Video, Globe } from 'lucide-react'
const TABS = [
  { id: 'All', icon: Globe },
  { id: 'AI', icon: Bot },
  { id: 'Tech', icon: Newspaper },
  { id: 'Security', icon: Shield },
  { id: 'Video', icon: Video }
]
export default function TabBar({ active, onChange }) {
  return (
    <div className="flex gap-2 p-2 border-b border-cyber-line bg-cyber-panel/60 backdrop-blur rounded-2xl">
      {TABS.map(({ id, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`px-3 py-2 rounded-xl flex items-center gap-2 font-mono text-sm transition ${
            active === id ? 'bg-cyber-line text-cyber-text' : 'hover:bg-cyber-line/70 text-cyber-text/80'
          }`}
          title={id}
        >
          <Icon size={16} />
          <span>{id}</span>
        </button>
      ))}
    </div>
  )
}
