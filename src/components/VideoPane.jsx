// src/components/VideoPane.jsx
import React from 'react';
import { toYouTubeEmbed } from '../api';

export default function VideoPane({ link, title }) {
  const embed = toYouTubeEmbed(link);

  if (embed) {
    return (
      <iframe
        className="w-full h-[80vh] rounded-lg border border-slate-700"
        src={embed}
        title={title || 'Video'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return (
    <div className="p-4 text-slate-300">
      <p>This video can’t be embedded.</p>
      <button
        className="mt-3 px-3 py-2 rounded bg-slate-800 border border-slate-700 hover:bg-slate-700"
        onClick={() => window.api.openExternal(link)}
      >
        Open on YouTube
      </button>
    </div>
  );
}
