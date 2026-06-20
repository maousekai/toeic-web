// Estimated TOEIC score from a mini-test result.
// This is an approximation for practice only, not the official ETS conversion.

export function estimateScore(listeningCorrect: number, listeningTotal: number, readingCorrect: number, readingTotal: number) {
  const lPct = listeningTotal > 0 ? listeningCorrect / listeningTotal : 0
  const rPct = readingTotal > 0 ? readingCorrect / readingTotal : 0
  // Listening scaled 5-495, Reading scaled 5-495
  const listeningScore = Math.round(5 + lPct * 490)
  const readingScore = Math.round(5 + rPct * 490)
  return {
    listeningScore,
    readingScore,
    total: listeningScore + readingScore,
  }
}

// CEFR-like band from total score
export function scoreBand(total: number): { band: string; color: string } {
  if (total >= 900) return { band: 'Expert (C1+)', color: 'emerald' }
  if (total >= 800) return { band: 'Advanced (C1)', color: 'emerald' }
  if (total >= 700) return { band: 'Upper-Intermediate (B2+)', color: 'teal' }
  if (total >= 600) return { band: 'Intermediate (B2)', color: 'amber' }
  if (total >= 400) return { band: 'Pre-Intermediate (B1)', color: 'orange' }
  return { band: 'Beginner (A2)', color: 'red' }
}
