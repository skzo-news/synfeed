import React from 'react'
import { ExternalLink } from 'lucide-react'
import { scoreBias } from '../lib/bias'
export default function FeedList({ items = [], onPickVideo }) {
  return (
    <div className="space-y-3">
      {items.map((it, idx) => {
        const bias = scoreBias({ title: it.title, content: it.contentSnippet })
        const isVideo = /youtube\.com|youtu\.be|vimeo\.com|\.mp4|\.webm/.test((it.link || '').toLowerCase())
        return (
          <div key={idx} className="noir-card p-4">
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="text-xs text-cyber-text/60 font-mono">{it.source} • {new Date(it.isoDate).toLocaleString()}</div>
                <h3 className="text-lg font-semibold mt-1 glitch" data-text={it.title}>{it.title}</h3>
                <p className="text-sm text-cyber-text/80 mt-2">{it.contentSnippet}</p>
                <div className="mt-3 flex items-center gap-2 text-xs font-mono">
                  <span className="px-2 py-1 rounded bg-cyber-line/70">Bias: {bias.label}</span>
                  <span className="px-2 py-1 rounded bg-cyber-line/70">Score: {bias.score}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {isVideo ? (
                  <button
                    className="px-3 py-2 rounded-xl bg-cyber-line hover:bg-cyber-line/80 text-sm font-mono"
                    onClick={() => onPickVideo(it.link)}
                  >
                    Play in App
                  </button>
                ) : null}
                {it.link ? (
                  <a
                    className="px-3 py-2 rounded-xl bg-cyber-line hover:bg-cyber-line/80 text-sm font-mono flex items-center gap-1"
                    href={it.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open <ExternalLink size={14} />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
