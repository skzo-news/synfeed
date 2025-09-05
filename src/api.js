// src/api.js
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  textNodeName: 'text',
});

export async function fetchAndParse(url, category) {
  const res = await window.api.fetchFeed(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const xml = res.text;

  const data = parser.parse(xml);

  // Normalize RSS 2.0 or Atom into a flat list of items
  let items = [];
  if (data?.rss?.channel?.item) {
    items = Array.isArray(data.rss.channel.item) ? data.rss.channel.item : [data.rss.channel.item];
  } else if (data?.feed?.entry) {
    items = Array.isArray(data.feed.entry) ? data.feed.entry : [data.feed.entry];
  }

  return items.map((it) => {
    const title = it.title?.text || it.title || '(untitled)';
    const link =
      it.link?.href || it.link?.text || it.link ||
      it.guid?.text || it.guid || '';
    const pubDate = it.pubDate || it.published || it.updated || '';
    const description =
      it.description?.text || it.summary?.text || it.content?.text || it.description || it.summary || '';

    // Try to pick a thumbnail if available
    const thumb =
      it['media:thumbnail']?.url ||
      it['media:content']?.url ||
      it.thumbnail?.url ||
      '';

    return { title, link, pubDate, description, thumb, category, source: domainFrom(link) };
  });
}

export function domainFrom(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
}

// Simple YouTube detector & embed URL
export function toYouTubeEmbed(link) {
  try {
    const u = new URL(link);
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }
  } catch {}
  return null;
}
