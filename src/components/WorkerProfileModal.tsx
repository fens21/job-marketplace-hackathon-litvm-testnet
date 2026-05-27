import { getProfile } from '../hooks/useWorkerProfiles'
import type { LeaderboardEntry } from '../types'
import { shorten } from '../utils'

function usdValue(entry: LeaderboardEntry | null, ltcPrice: number | null): string {
  if (!entry || ltcPrice === null) return '...'
  const v = entry.earnedZkltc * ltcPrice + entry.earnedUsdc
  if (v < 1) return '$' + v.toFixed(2)
  if (v < 1000) return '$' + v.toFixed(0)
  return '$' + (v / 1000).toFixed(1) + 'k'
}

export function WorkerProfileModal({ worker, leaderboardEntry, rank, onClose, ltcPrice }: {
  worker: string
  leaderboardEntry: LeaderboardEntry | null
  rank: number
  onClose: () => void
  ltcPrice: number | null
}) {
  const profile = getProfile(worker)

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div style={{ background: '#111', border: '1px solid #444', padding: 32, borderRadius: 16, maxWidth: 500, width: '90%', maxHeight: '80vh', overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, background: '#ffd700', borderRadius: '50%', flexShrink: 0 }}></div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 600, wordBreak: 'break-all' }}>{shorten(worker)}</div>
            <div style={{ fontSize: 13, opacity: 0.6, fontFamily: 'monospace' }}>
              {worker.slice(0, 8)}...{worker.slice(-6)}
            </div>
          </div>
          <button onClick={onClose} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#888', fontSize: 22, cursor: 'pointer' }}>&times;</button>
        </div>

        {leaderboardEntry && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
            <MiniStat label="Rank" value={`#${rank}`} color={rank === 1 ? '#ffd700' : rank === 2 ? '#c0c0c0' : rank === 3 ? '#cd7f32' : undefined} />
            <MiniStat label="Points" value={`${leaderboardEntry.points}`} highlight />
            <MiniStat label="Earned" value={usdValue(leaderboardEntry, ltcPrice)} highlight sub={leaderboardEntry.earnedZkltc > 0 || leaderboardEntry.earnedUsdc > 0 ?
              `${leaderboardEntry.earnedZkltc > 0 ? leaderboardEntry.earnedZkltc + ' zkLTC' : ''}${leaderboardEntry.earnedZkltc > 0 && leaderboardEntry.earnedUsdc > 0 ? ' + ' : ''}${leaderboardEntry.earnedUsdc > 0 ? leaderboardEntry.earnedUsdc + ' USDC' : ''}` : undefined} />
          </div>
        )}

        {profile ? (
          <>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Bio</div>
              <div style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>{profile.bio || 'No bio set.'}</div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Skills & Expertise</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(profile.skills && profile.skills.length > 0 ? profile.skills : ['—']).map((s, i) => (
                  <span key={i} style={{ background: '#222', padding: '5px 13px', borderRadius: 999, fontSize: 13, border: '1px solid #444' }}>{s}</span>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={{ background: '#1a1a1a', padding: 16, borderRadius: 8, marginBottom: 20, textAlign: 'center', opacity: 0.6, fontSize: 13 }}>
            This worker hasn&apos;t set up their profile yet.
          </div>
        )}

        <div style={{ borderTop: '1px solid #333', paddingTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <MiniStat label="Jobs Claimed" value={`${leaderboardEntry?.jobsClaimed ?? 0}`} />
            <MiniStat label="Jobs Paid" value={`${leaderboardEntry?.jobsPaid ?? 0}`} />
            <MiniStat label="Total Earned" value={usdValue(leaderboardEntry, ltcPrice)} highlight sub={leaderboardEntry && (leaderboardEntry.earnedZkltc > 0 || leaderboardEntry.earnedUsdc > 0) ?
              `${leaderboardEntry.earnedZkltc > 0 ? leaderboardEntry.earnedZkltc + ' zkLTC' : ''}${leaderboardEntry.earnedZkltc > 0 && leaderboardEntry.earnedUsdc > 0 ? ' + ' : ''}${leaderboardEntry.earnedUsdc > 0 ? leaderboardEntry.earnedUsdc + ' USDC' : ''}` : undefined} />
          </div>
        </div>
      </div>
    </div>
  )
}

function MiniStat({ label, value, highlight, color, sub }: { label: string; value: string; highlight?: boolean; color?: string; sub?: string }) {
  return (
    <div style={{ background: '#1a1a1a', padding: '10px 12px', borderRadius: 8, textAlign: 'center' }}>
      <div style={{ fontSize: 10, opacity: 0.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4, color: color ? color : highlight ? '#ffd700' : '#c0c0c0' }}>{value}</div>
      {sub && <div style={{ fontSize: 9, opacity: 0.4, marginTop: 2 }}>{sub}</div>}
    </div>
  )
}
