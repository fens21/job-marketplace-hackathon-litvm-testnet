import type { Job, LeaderboardEntry } from '../types'

function formatUsd(entry: LeaderboardEntry, ltcPrice: number | null): string {
  if (ltcPrice === null) return '...'
  const usd = entry.earnedZkltc * ltcPrice + entry.earnedUsdc
  if (usd < 1) return '$' + usd.toFixed(2)
  if (usd < 1000) return '$' + usd.toFixed(0)
  return '$' + (usd / 1000).toFixed(1) + 'k'
}

function jobUsd(reward: number, tokenSymbol: string | undefined, ltcPrice: number | null): string {
  if (ltcPrice === null) return ''
  const rate = tokenSymbol === 'USDC' ? 1 : ltcPrice
  const usd = reward * rate
  if (usd < 1) return '$' + usd.toFixed(2)
  if (usd < 1000) return '$' + usd.toFixed(0)
  return '$' + (usd / 1000).toFixed(1) + 'k'
}

export function Stats({ onChainJobs, leaderboard, leaderboardLoading, onViewWorker, ltcPrice, address }: {
  onChainJobs: Job[]
  leaderboard: LeaderboardEntry[]
  leaderboardLoading: boolean
  onViewWorker: (worker: string, entry: LeaderboardEntry, rank: number) => void
  ltcPrice: number | null
  address: string
}) {
  const totalEscrowed = onChainJobs.reduce((s, j) => s + j.reward * j.maxWorkers, 0)
  const ownEntry = leaderboard.find(e => address && e.worker.toLowerCase() === address.toLowerCase())
  const earnedZkltc = ownEntry?.earnedZkltc ?? 0
  const earnedUsdc = ownEntry?.earnedUsdc ?? 0
  const jobsPaid = ownEntry?.jobsPaid ?? 0

  const dedupedJobs = [...new Map(onChainJobs.map(j => [j.id, j])).values()]
  const usdRate = (t: string | undefined) => t === 'USDC' ? 1 : (ltcPrice ?? 0)
  const topReward = [...dedupedJobs].sort((a, b) => (b.reward * usdRate(b.tokenSymbol)) - (a.reward * usdRate(a.tokenSymbol))).slice(0, 8)
  const topClaimed = [...dedupedJobs].filter(j => j.claimedCount > 0).sort((a, b) => b.claimedCount - a.claimedCount).slice(0, 8)

  const earnedUsd = (ltcPrice ?? 0) * earnedZkltc + earnedUsdc

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        <EarnedCard label="My Earned" usd={earnedUsd} zkltc={earnedZkltc} usdc={earnedUsdc} ltcPrice={ltcPrice} />
        <StatCard label="My Completed" value={`${jobsPaid}`} />
        <StatCard label="My Completed" value={`${jobsPaid}`} />
        <StatCard label="On-Chain Jobs" value={`${onChainJobs.length}`} />
        <StatCard label="Total Escrowed" value={`${totalEscrowed} zkLTC`} highlight />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>

        <div style={{ minWidth: 0 }}>
           <h3 style={{ fontSize: 14, marginBottom: 12, color: '#e0e0e0' }}>Top Worker Leaderboard</h3>
          {leaderboardLoading ? (
            <div style={{ background: '#111', border: '1px solid #333', borderRadius: 12, padding: 24, textAlign: 'center', opacity: 0.6 }}>
              Loading on-chain data...
            </div>
          ) : leaderboard.length === 0 ? (
            <div style={{ background: '#111', border: '1px solid #333', borderRadius: 12, padding: 24, textAlign: 'center', opacity: 0.6 }}>
              No workers yet &mdash; be the first to claim a job!
            </div>
          ) : (
            <div style={{ background: '#111', border: '1px solid #333', borderRadius: 12, padding: '8px 12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 40px 88px 48px 44px', padding: '8px 4px', borderBottom: '1px solid #333', fontSize: 10, opacity: 0.45, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                <span>#</span><span>Worker</span><span>Jobs</span><span>Earned</span><span>Pts</span><span></span>
              </div>
              {leaderboard.slice(0, 10).map((w, i) => (
                <div key={w.worker} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 40px 88px 48px 44px', padding: '10px 4px', borderBottom: i < Math.min(leaderboard.length - 1, 9) ? '1px solid #1a1a1a' : 'none', alignItems: 'center', fontSize: 12 }}>
                  <span style={{ color: i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : '#888', fontWeight: 700 }}>#{i + 1}</span>
                  <button
                    onClick={() => onViewWorker(w.worker, w, i + 1)}
                    style={{ background: 'transparent', border: 'none', color: '#ffd700', cursor: 'pointer', fontFamily: 'monospace', fontSize: 11, textAlign: 'left', padding: 0, textDecoration: 'underline', textUnderlineOffset: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {w.worker.slice(0, 4)}...{w.worker.slice(-4)}
                  </button>
                  <span style={{ fontSize: 11, opacity: 0.7 }}>{w.jobsPaid}<span style={{ opacity: 0.3 }}>/</span>{w.jobsClaimed}</span>
                  <span style={{ lineHeight: 1.5 }}>
                    <span style={{ color: '#4ade80', fontWeight: 600, fontSize: 11 }}>{formatUsd(w, ltcPrice)}</span>
                    {w.earnedZkltc > 0 && <span style={{ display: 'block', fontSize: 9, opacity: 0.55, color: '#ffd700' }}>{w.earnedZkltc} zkLTC</span>}
                    {w.earnedUsdc > 0 && <span style={{ display: 'block', fontSize: 9, opacity: 0.55, color: '#2775ca' }}>{w.earnedUsdc} USDC</span>}
                  </span>
                  <span style={{ color: '#4ade80', fontWeight: 600, fontSize: 12 }}>{w.points}</span>
                  <button
                    onClick={() => onViewWorker(w.worker, w, i + 1)}
                    style={{ background: '#1a1a1a', border: '1px solid #444', color: '#aaa', padding: '3px 8px', borderRadius: 4, cursor: 'pointer', fontSize: 10, fontWeight: 600 }}>
                    VIEW
                  </button>
                </div>
              ))}
              {leaderboard.length > 10 && (
                <div style={{ textAlign: 'center', fontSize: 11, opacity: 0.4, padding: '8px 0' }}>
                  +{leaderboard.length - 10} more workers
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ minWidth: 0 }}>
          <h3 style={{ fontSize: 14, marginBottom: 12, color: '#e0e0e0' }}>Top Jobs by Reward</h3>
          {topReward.length === 0 ? (
            <div style={{ background: '#111', border: '1px solid #333', borderRadius: 12, padding: 24, textAlign: 'center', opacity: 0.5, fontSize: 13 }}>
              No on-chain jobs yet &mdash; post the first one!
            </div>
          ) : (
            <div style={{ background: '#111', border: '1px solid #333', borderRadius: 12, padding: '8px 12px' }}>
              {topReward.map((j, i) => (
                <div key={j.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 4px', borderBottom: i < topReward.length - 1 ? '1px solid #1a1a1a' : 'none', fontSize: 12, gap: 8 }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.title}</span>
                  <span style={{ textAlign: 'right', flexShrink: 0, lineHeight: 1.5 }}>
                    <span style={{ color: '#4ade80', fontWeight: 600, fontSize: 12 }}>{jobUsd(j.reward, j.tokenSymbol, ltcPrice)}</span>
                    <br />
                    <span style={{ color: j.tokenSymbol === 'USDC' ? '#2775ca' : '#ffd700', fontSize: 10, opacity: 0.7 }}>{j.reward} {j.tokenSymbol || 'zkLTC'}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ minWidth: 0 }}>
          <h3 style={{ fontSize: 14, marginBottom: 12, color: '#e0e0e0' }}>Most Claimed Jobs</h3>
          {topClaimed.length === 0 ? (
            <div style={{ background: '#111', border: '1px solid #333', borderRadius: 12, padding: 24, textAlign: 'center', opacity: 0.5, fontSize: 13 }}>
              No claims yet
            </div>
          ) : (
            <div style={{ background: '#111', border: '1px solid #333', borderRadius: 12, padding: '8px 12px' }}>
              {topClaimed.map((j, i) => (
                <div key={j.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 4px', borderBottom: i < topClaimed.length - 1 ? '1px solid #1a1a1a' : 'none', fontSize: 12, gap: 8 }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.title}</span>
                  <span style={{ color: '#4ade80', fontWeight: 600, flexShrink: 0 }}>{j.claimedCount}/{j.maxWorkers}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

function EarnedCard({ label, usd, zkltc, usdc, ltcPrice }: { label: string; usd: number; zkltc: number; usdc: number; ltcPrice: number | null }) {
  const usdStr = ltcPrice === null ? '...' : usd < 1 ? '$' + usd.toFixed(2) : usd < 1000 ? '$' + usd.toFixed(0) : '$' + (usd / 1000).toFixed(1) + 'k'
  return (
    <div style={{ background: '#111', padding: 20, border: '1px solid #2a2a2a', borderRadius: 12 }}>
      <div style={{ fontSize: 12, opacity: 0.45, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 28, color: '#4ade80', fontWeight: 700, marginTop: 4 }}>{usdStr}</div>
      {zkltc > 0 && <div style={{ fontSize: 14, color: '#ffd700', fontWeight: 600, marginTop: 4 }}>{zkltc} zkLTC</div>}
      {usdc > 0 && <div style={{ fontSize: 14, color: '#2775ca', fontWeight: 600, marginTop: 2 }}>{usdc} USDC</div>}
      {zkltc === 0 && usdc === 0 && <div style={{ fontSize: 14, opacity: 0.4, marginTop: 4 }}>No earnings yet</div>}
    </div>
  )
}

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ background: '#111', padding: 20, border: '1px solid #2a2a2a', borderRadius: 12 }}>
      <div style={{ fontSize: 12, opacity: 0.45, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 32, color: highlight ? '#ffd700' : '#e0e0e0', fontWeight: 700, marginTop: 6 }}>{value}</div>
    </div>
  )
}
