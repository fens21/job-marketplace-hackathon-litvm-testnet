import type { Job, LeaderboardEntry } from '../types'

export function Profile({ account, myJobs, bio, skills, setEditBio, setShowEditProfile, leaderboard, ltcPrice }: {
  account: string
  myJobs: Job[]
  bio: string
  skills: string[]
  setEditBio: (v: string) => void
  setShowEditProfile: (v: boolean) => void
  leaderboard: LeaderboardEntry[]
  ltcPrice: number | null
}) {
  const ownEntry = leaderboard.find(e => e.worker.toLowerCase() === account.toLowerCase())
  const rank = leaderboard.findIndex(e => e.worker.toLowerCase() === account.toLowerCase()) + 1
  const points = ownEntry?.points ?? 0
  const jobsClaimed = ownEntry?.jobsClaimed ?? 0
  const jobsPaid = ownEntry?.jobsPaid ?? 0
  const earnedZkltc = ownEntry?.earnedZkltc ?? 0
  const earnedUsdc = ownEntry?.earnedUsdc ?? 0
  const earnedUsd = (ltcPrice ?? 0) * earnedZkltc + earnedUsdc
  const successRate = jobsClaimed > 0 ? Math.round((jobsPaid / jobsClaimed) * 100) : 0
  const inProgress = myJobs.filter(j => j.status === 'claimed').length
  const awaitingPayment = myJobs.filter(j => j.status === 'completed').length

  const recentActivity = Object.values(
    Object.fromEntries(myJobs.map(j => [j.id, j]))
  )
    .sort((a, b) => b.id - a.id)
    .slice(0, 5)

  return (
    <div>
      <div style={{ background: '#111', padding: 28, border: '1px solid #333', borderRadius: 16 }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{ width: 64, height: 64, background: '#ffd700', borderRadius: '50%', flexShrink: 0 }}></div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>{account.slice(0, 6)}...{account.slice(-4)}</div>
            <div style={{ fontSize: 13, opacity: 0.6, fontFamily: 'monospace' }}>
              {account.slice(0, 8)}...{account.slice(-6)}
            </div>
            <div style={{ color: rank === 1 ? '#ffd700' : rank === 2 ? '#c0c0c0' : rank === 3 ? '#cd7f32' : '#ffd700', fontSize: 14, marginTop: 4 }}>
              {rank > 0 ? `#${rank} on Leaderboard` : 'Unranked'}
            </div>
          </div>
          <button onClick={() => { setEditBio(bio); setShowEditProfile(true) }} style={{ marginLeft: 'auto', padding: '6px 14px', background: '#222', border: '1px solid #555', color: '#fff', borderRadius: 6, fontSize: 13 }}>
            Edit Profile
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 24 }}>
          <MiniStat label="Rank" value={rank > 0 ? `#${rank}` : '—'} color={rank === 1 ? '#ffd700' : rank === 2 ? '#c0c0c0' : rank === 3 ? '#cd7f32' : undefined} />
          <MiniStat label="Points" value={`${points} pts`} highlight />
          <MiniStat label="Success Rate" value={`${successRate}%`} color={successRate >= 80 ? '#4ade80' : successRate >= 50 ? '#ffd700' : '#ff6b6b'} />
          <div style={{ background: '#1a1a1a', padding: '12px 12px', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 10, opacity: 0.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Earned</div>
            <div style={{ fontSize: earnedZkltc + earnedUsdc > 0 ? 16 : 13, fontWeight: 700, marginTop: 4, color: '#4ade80' }}>
              {ltcPrice && earnedUsd > 0 ? (earnedUsd < 1000 ? `$${earnedUsd.toFixed(0)}` : `$${(earnedUsd / 1000).toFixed(1)}k`) : earnedZkltc + earnedUsdc === 0 ? '—' : `${earnedZkltc + earnedUsdc}`}
            </div>
            {earnedZkltc > 0 && <div style={{ fontSize: 12, color: '#ffd700', fontWeight: 600 }}>{earnedZkltc} zkLTC</div>}
            {earnedUsdc > 0 && <div style={{ fontSize: 12, color: '#2775ca', fontWeight: 600 }}>{earnedUsdc} USDC</div>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 24 }}>
          <MiniStat label="Jobs Claimed" value={`${jobsClaimed}`} />
          <MiniStat label="Jobs Paid" value={`${jobsPaid}`} />
          <MiniStat label="In Progress" value={`${inProgress}`} color={inProgress > 0 ? '#ffd700' : undefined} />
          <MiniStat label="Awaiting Pay" value={`${awaitingPayment}`} color={awaitingPayment > 0 ? '#f97316' : undefined} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Bio</div>
          <div style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>{bio}</div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Skills & Expertise</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {skills.map((s, i) => (
              <span key={i} style={{ background: '#222', padding: '5px 13px', borderRadius: 999, fontSize: 13, border: '1px solid #444' }}>{s}</span>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #333', paddingTop: 16 }}>
          {recentActivity.length > 0 ? (
            <div>
              <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Recent Activity</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {recentActivity.map((job, i) => (
                  <div key={i} style={{ background: '#1a1a1a', padding: '10px 14px', borderRadius: 6, fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{job.title.slice(0, 30)}{job.title.length > 30 ? '...' : ''}</span>
                    <span style={{ color: job.status === 'paid' ? '#4ade80' : job.status === 'completed' ? '#ffd700' : '#888', fontSize: 12, fontWeight: 600 }}>
                      {job.status === 'paid' ? `+${job.reward} ${job.tokenSymbol || 'zkLTC'}` : job.status === 'completed' ? 'PROOF SENT' : 'CLAIMED'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', opacity: 0.4, fontSize: 13, padding: '16px 0' }}>
              No activity yet — claim a job to get started
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MiniStat({ label, value, highlight, color }: { label: string; value: string; highlight?: boolean; color?: string }) {
  return (
    <div style={{ background: '#1a1a1a', padding: '12px 12px', borderRadius: 8, textAlign: 'center' }}>
      <div style={{ fontSize: 10, opacity: 0.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4, color: color ? color : highlight ? '#ffd700' : '#c0c0c0' }}>{value}</div>
    </div>
  )
}
