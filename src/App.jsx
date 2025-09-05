// src/App.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { FEEDS } from './feeds';
import { fetchAndParse, toYouTubeEmbed } from './api';
import { Globe, Cpu, Shield, PlayCircle } from 'lucide-react';
import UpdateBanner from './UpdateBanner';

const CATS = ['All', 'AI', 'Tech', 'Security', 'Video'];

export default function App() {
  const [cat, setCat] = useState('All');
  const [items, setItems] = useState([]);
  const [sel, setSel] = useState(null);
  const [loading, setLoading] = useState(false);
  const feedList = FEEDS[cat];

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const results = await Promise.all(feedList.map(f => fetchAndParse(f.url, cat)));
        const flat = results.flat();
        flat.sort((a,b) => new Date(b.pubDate) - new Date(a.pubDate));
        setItems(flat);
        setSel(null);
      } catch (e) {
        console.error(e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [cat]); // eslint-disable-line

  const embed = useMemo(() => sel ? toYouTubeEmbed(sel.link) : null, [sel]);

  return (
    <div className="h-full grid grid-cols-[380px_1fr]">
      {/* Left column: nav + list */}
      <div className="h-full border-r border-slate-700/50 overflow-hidden">
        <header className="p-3 border-b border-slate-700/50 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-cyan-300">SynFeed</h1>
            <p className="text-xs text-slate-400">Bias-aware • Local parsing</p>
          </div>
          <UpdateBanner />
        </header>

        <nav className="p-2 flex gap-2 flex-wrap">
          <Tab active={cat==='All'} onClick={()=>setCat('All')} label="All" Icon={Globe}/>
          <Tab active={cat==='AI'} onClick={()=>setCat('AI')} label="AI" Icon={Cpu}/>
          <Tab active={cat==='Tech'} onClick={()=>setCat('Tech')} label="Tech" Icon={Globe}/>
          <Tab active={cat==='Security'} onClick={()=>setCat('Security')} label="Security" Icon={Shield}/>
          <Tab active={cat==='Video'} onClick={()=>setCat('Video')} label="Video" Icon={PlayCircle}/>
        </nav>

        <section className="h-[calc(100%-110px)] overflow-auto">
          {loading && <div className="p-4 text-slate-400">Loading {cat}…</div>}
          {!loading && items.length === 0 && (
            <div className="p-4 text-slate-400">No items yet.</div>
          )}
          <ul className="divide-y divide-slate-800">
            {items.map((it, i) => (
              <li key={i} className="p-3 hover:bg-slate-800/50 cursor-pointer" onClick={()=>setSel(it)}>
                <div className="text-sm text-slate-400">{it.source}</div>
                <div className="font-medium text-slate-100">{it.title}</div>
                <div className="text-xs text-slate-500">{new Date(it.pubDate || Date.now()).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Right column: viewer */}
      <div className="h-full p-4">
        {!sel && (
          <div className="h-full grid place-items-center text-slate-400">
            Select an item from the feed to view it here.
          </div>
        )}

        {sel && embed && (
          <div className="h-full">
            <h2 className="text-lg font-semibold mb-2">{sel.title}</h2>
            <iframe
              className="w-full h-[80vh] rounded-lg border border-slate-700"
              src={embed}
              title={sel.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}

        {sel && !embed && (
          <div className="h-full">
            <h2 className="text-lg font-semibold">{sel.title}</h2>
            <p className="text-sm text-slate-400 mb-4">{sel.source}</p>
            <button
              className="px-3 py-2 rounded bg-slate-800 border border-slate-700 hover:bg-slate-700"
              onClick={()=>window.api.openExternal(sel.link)}
            >
              Open article in browser
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Tab({ active, onClick, label, Icon }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded border text-sm flex items-center gap-2
        ${active ? 'bg-slate-800 border-slate-600 text-slate-100' : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'}`}
    >
      <Icon size={16}/>
      {label}
    </button>
  );
}
