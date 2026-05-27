import type { Job, ConfirmAction, DisputeState } from '../types'

const shorten = (addr: string) => addr.length > 10 ? addr.slice(0, 6) + '...' + addr.slice(-4) : addr

export function JobDetailModal({ job, onClose, onClaim, loading }: { job: Job; onClose: () => void; onClaim: (job: Job) => void; loading: boolean }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: '#111', border: '1px solid #444', padding: 32, borderRadius: 10, maxWidth: 520, width: '90%' }}>
        <h3 style={{ marginTop: 0 }}>{job.title}</h3>
        <p style={{ opacity: 0.8 }}>{job.description}</p>
        <div style={{ margin: '20px 0', fontSize: 14, lineHeight: 1.6 }}>
          <div><strong>Requirements:</strong> {job.requirements}</div>
          <div><strong>Difficulty:</strong> {job.difficulty}</div>
          <div><strong>Reward:</strong> {job.reward} {job.tokenSymbol || 'zkLTC'}</div>
          <div><strong>Deadline:</strong> {job.deadline}</div>
          <div><strong>Slots:</strong> {job.claimedCount}/{job.maxWorkers} workers</div>
          <div><strong>Posted by:</strong> {shorten(job.poster)}</div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 12, border: '1px solid #555', background: 'transparent', color: '#c0c0c0', borderRadius: 6 }}>CLOSE</button>
          <button onClick={() => onClaim(job)} disabled={loading} style={{ flex: 1, padding: 12, background: '#ffd700', color: '#000', fontWeight: 700, border: 'none', borderRadius: 6 }}>CLAIM THIS JOB</button>
        </div>
      </div>
    </div>
  )
}

export function ProofModal({ job, proofHash, onProofHashChange, onSubmit, onClose, loading }: {
  job: Job
  proofHash: string
  onProofHashChange: (v: string) => void
  onSubmit: () => void
  onClose: () => void
  loading: boolean
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: '#111', border: '1px solid #444', padding: 32, borderRadius: 10, maxWidth: 420, width: '90%' }}>
        <h3 style={{ marginTop: 0 }}>Submit ZK Proof</h3>
        <p style={{ opacity: 0.7, fontSize: 14 }}>{job.title} &mdash; {job.reward} {job.tokenSymbol || 'zkLTC'}</p>
        <input
          placeholder="0xproof..."
          value={proofHash}
          onChange={e => onProofHashChange(e.target.value)}
          style={{ width: '100%', background: '#000', border: '1px solid #444', padding: 12, color: '#fff', margin: '16px 0', fontSize: 14 }}
        />
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 12, border: '1px solid #555', background: 'transparent', color: '#c0c0c0', borderRadius: 6 }}>CANCEL</button>
          <button onClick={onSubmit} disabled={loading} style={{ flex: 1, padding: 12, background: '#ffd700', color: '#000', fontWeight: 700, border: 'none', borderRadius: 6 }}>VERIFY PROOF</button>
        </div>
      </div>
    </div>
  )
}

export function ConfirmModal({ action, onCancel, onConfirm }: { action: ConfirmAction; onCancel: () => void; onConfirm: () => void }) {
  const typeLabel = action.type === 'unclaim' ? 'Unclaim Job?' : action.type === 'deactivate' ? 'Deactivate Job?' : action.type === 'dispute' ? 'Raise Dispute?' : action.type === 'resolveCancel' ? 'Accept Cancellation?' : 'Submit Proof?'
  const msg = action.type === 'unclaim'
    ? `Are you sure you want to unclaim "${action.job?.title}"?`
    : action.type === 'deactivate'
    ? `Deactivate "${action.job?.title}"? No workers have claimed yet.`
    : action.type === 'dispute'
    ? `File a dispute for "${action.job?.title}"?\n\nWorker: ${(action.disputeWorker || '').slice(0, 8)}...\nReason: ${action.disputeReason || '—'}`
    : action.type === 'resolveCancel'
    ? `Accept cancellation for "${action.job?.title}"? This will remove your claim.`
    : `Verify and submit proof for "${action.job?.title}"?`
  const btnLabel = action.type === 'unclaim' ? 'UNCLAIM' : action.type === 'deactivate' ? 'DEACTIVATE' : action.type === 'dispute' ? 'FILE DISPUTE' : action.type === 'resolveCancel' ? 'ACCEPT CANCEL' : 'VERIFY PROOF'
  const btnColor = action.type === 'unclaim' || action.type === 'deactivate' ? '#ff6b6b' : action.type === 'resolveCancel' ? '#f97316' : '#ffd700'

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div style={{ background: '#111', border: '1px solid #444', padding: 32, borderRadius: 12, maxWidth: 420, width: '90%' }}>
        <h3 style={{ marginTop: 0 }}>
          {typeLabel}
        </h3>
        <p style={{ opacity: 0.8, whiteSpace: 'pre-wrap' }}>
          {msg}
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: 12, border: '1px solid #555', background: 'transparent', color: '#c0c0c0', borderRadius: 8 }}>CANCEL</button>
          <button
            onClick={onConfirm}
            style={{ flex: 1, padding: 12, background: btnColor, color: action.type === 'unclaim' || action.type === 'deactivate' ? '#fff' : '#000', fontWeight: 700, border: 'none', borderRadius: 8 }}>
            {btnLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export function EditProfileModal({ editBio, setEditBio, editSkillInput, setEditSkillInput, skills, setSkills, onClose, onSave }: {
  editBio: string
  setEditBio: (v: string) => void
  editSkillInput: string
  setEditSkillInput: (v: string) => void
  skills: string[]
  setSkills: (v: string[]) => void
  onClose: () => void
  onSave: () => void
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: '#111', border: '1px solid #444', padding: 32, borderRadius: 12, width: '90%', maxWidth: 440 }}>
        <h3 style={{ marginTop: 0 }}>Edit Profile</h3>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 6 }}>Bio</div>
          <textarea value={editBio} onChange={e => setEditBio(e.target.value)} style={{ width: '100%', background: '#000', border: '1px solid #444', padding: 12, color: '#fff', borderRadius: 8, minHeight: 90, fontSize: 14 }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 8 }}>Skills</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
            {skills.map((s, i) => (
              <span key={i} style={{ background: '#222', padding: '5px 13px', borderRadius: 999, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {s} <span onClick={() => setSkills(skills.filter((_, idx) => idx !== i))} style={{ cursor: 'pointer', color: '#f66', fontWeight: 700 }}>&times;</span>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={editSkillInput} onChange={e => setEditSkillInput(e.target.value)} placeholder="Add skill" style={{ flex: 1, background: '#000', border: '1px solid #444', padding: '10px 12px', color: '#fff', borderRadius: 8, fontSize: 14 }} />
            <button onClick={() => { if (editSkillInput.trim()) { setSkills([...skills, editSkillInput.trim()]); setEditSkillInput('') } }} style={{ padding: '0 18px', background: '#222', border: '1px solid #555', color: '#fff', borderRadius: 8 }}>+</button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 12, border: '1px solid #555', background: 'transparent', color: '#c0c0c0', borderRadius: 8 }}>CANCEL</button>
          <button onClick={onSave} style={{ flex: 1, padding: 12, background: '#ffd700', color: '#000', fontWeight: 700, border: 'none', borderRadius: 8 }}>SAVE</button>
        </div>
      </div>
    </div>
  )
}

export function DisputeModal({ dispute, onReasonChange, onSubmit, onClose, loading }: {
  dispute: DisputeState
  onReasonChange: (v: string) => void
  onSubmit: () => void
  onClose: () => void
  loading: boolean
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: '#111', border: '1px solid #f97316', padding: 32, borderRadius: 12, maxWidth: 440, width: '90%' }}>
        <h3 style={{ marginTop: 0, color: '#f97316' }}>Raise Dispute</h3>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 14, opacity: 0.7 }}>Job: <strong>{dispute.job.title}</strong></div>
          <div style={{ fontSize: 14, opacity: 0.7 }}>Reward: {dispute.job.reward} {dispute.job.tokenSymbol || 'zkLTC'}</div>
          {dispute.worker && (
            <div style={{ fontSize: 13, opacity: 0.6, fontFamily: 'monospace', marginTop: 4 }}>
              Worker: {dispute.worker.slice(0, 8)}...{dispute.worker.slice(-6)}
            </div>
          )}
        </div>
        <textarea
          placeholder="Describe your reason for dispute..."
          value={dispute.reason}
          onChange={e => onReasonChange(e.target.value)}
          style={{ width: '100%', background: '#000', border: '1px solid #444', padding: 12, color: '#fff', minHeight: 100, fontSize: 14, borderRadius: 8 }}
        />
        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 12, border: '1px solid #555', background: 'transparent', color: '#c0c0c0', borderRadius: 8 }}>CANCEL</button>
          <button onClick={onSubmit} disabled={loading || !dispute.reason.trim()} style={{ flex: 1, padding: 12, background: '#f97316', color: '#000', fontWeight: 700, border: 'none', borderRadius: 8 }}>
            {loading ? 'FILING...' : 'FILE DISPUTE'}
          </button>
        </div>
      </div>
    </div>
  )
}
