import React from 'react'
import ReactPlayer from 'react-player'
export default function VideoPane({ url }) {
  if (!url) {
    return (
      <div className="h-full w-full flex items-center justify-center text-cyber-text/60 font-mono">
        Select a video from the feed to play here.
      </div>
    )
  }
  return (
    <div className="h-full w-full noir-card p-3">
      <div className="rounded-xl overflow-hidden aspect-video">
        <ReactPlayer url={url} width="100%" height="100%" controls playing={false} />
      </div>
      <div className="text-xs text-cyber-text/70 font-mono mt-2 break-all">{url}</div>
    </div>
  )
}
