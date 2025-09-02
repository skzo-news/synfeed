const SUBJECTIVE_WORDS = [
  'i think','we think','i believe','we believe','clearly','obviously','shockingly','disaster',
  'amazing','terrible','best','worst','huge','massive','incredible','unbelievable','must-see',
  'will change everything','game-changer','finally','at last','everyone','nobody'
]
export function scoreBias({ title = '', content = '' }) {
  const text = (title + ' ' + content).toLowerCase()
  const exclam = (text.match(/!/g) || []).length
  const subjectiveHits = SUBJECTIVE_WORDS.reduce((acc, w) => acc + (text.includes(w) ? 1 : 0), 0)
  const quotes = (text.match(/\"/g) || []).length / 2
  let score = 0
  score += subjectiveHits * 12
  score += Math.min(exclam, 3) * 8
  score -= Math.min(quotes, 4) * 3
  score = Math.max(0, Math.min(100, score))
  let label = 'Neutral-ish'
  if (score >= 60) label = 'Likely Opinionated'
  else if (score >= 30) label = 'Mixed Tone'
  return { score, label }
}
