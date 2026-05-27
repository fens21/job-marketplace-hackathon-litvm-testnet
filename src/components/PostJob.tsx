import type { Job, NewJobForm, PostSubTab } from '../types'
import { PostedJobCard } from './PostedJobCard'

const TOKEN_SYMBOLS: Record<string, string> = { zkLTC: 'zkLTC', USDC: 'USDC' }
const TOKEN_COLORS: Record<string, string> = { zkLTC: '#ffd700', USDC: '#2775ca' }

export function PostJob({ postSubTab, setPostSubTab, newJob, setNewJob, postedJobs, onPost, onReleaseWorker, onDeactivate, onDispute, loading, account }: {
  postSubTab: PostSubTab
  setPostSubTab: (v: PostSubTab) => void
  newJob: NewJobForm
  setNewJob: (v: NewJobForm) => void
  postedJobs: Job[]
  onPost: () => void
  onReleaseWorker: (worker: string, j: Job) => void
  onDeactivate: (j: Job) => void
  onDispute: (j: Job, worker?: string) => void
  loading: boolean
  account: string
}) {
  return (
    <div>
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <h2 style={{ fontSize: 28, margin: 0, marginBottom: 12 }}>
          {postSubTab === 'new' ? 'Post New Compute Job' : 'Manage Posted Jobs'}
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: 4, background: '#222', borderRadius: 8, padding: 4 }}>
            <button
              onClick={() => setPostSubTab('new')}
              style={{
                background: postSubTab === 'new' ? '#ffd700' : 'transparent',
                color: postSubTab === 'new' ? '#000' : '#888',
                border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600,
              }}>
              + New Job
            </button>
            <button
              onClick={() => setPostSubTab('manage')}
              style={{
                background: postSubTab === 'manage' ? '#ffd700' : 'transparent',
                color: postSubTab === 'manage' ? '#000' : '#888',
                border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600,
              }}>
              Manage Posted
            </button>
          </div>
        </div>
      </div>

      {postSubTab === 'new' ? (
        <NewJobForm_ postSubTab={postSubTab} setPostSubTab={setPostSubTab} newJob={newJob} setNewJob={setNewJob} postedJobs={postedJobs} onPost={onPost} onReleaseWorker={onReleaseWorker} loading={loading} account={account} />
      ) : (
        <div>
          {postedJobs.length === 0 ? (
            <div style={{ opacity: 0.6, padding: 40, textAlign: 'center' }}>No posted jobs yet &mdash; post your first job!</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
              {postedJobs.map(job => (
                <PostedJobCard key={job.id} job={job} onRelease={onReleaseWorker} onDeactivate={onDeactivate} onDispute={onDispute} loading={loading} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function NewJobForm_({ newJob, setNewJob, onPost, loading }: {
  postSubTab: PostSubTab
  setPostSubTab: (v: PostSubTab) => void
  newJob: NewJobForm
  setNewJob: (v: NewJobForm) => void
  postedJobs: Job[]
  onPost: () => void
  onReleaseWorker: (worker: string, j: Job) => void
  loading: boolean
  account: string
}) {
  const update = (partial: Partial<NewJobForm>) => setNewJob({ ...newJob, ...partial })
  const tokenColor = TOKEN_COLORS[newJob.token] || '#ffd700'
  const tokenSymbol = TOKEN_SYMBOLS[newJob.token] || 'zkLTC'

  return (
    <div style={{ background: '#111', padding: 28, border: '1px solid #333', borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 18, justifyContent: 'center' }}>
        <button
          onClick={() => update({ token: 'zkLTC' })}
          style={{
            flex: 1, padding: '10px 0', fontSize: 14, fontWeight: 700, border: newJob.token === 'zkLTC' ? `2px solid #ffd700` : '2px solid #444',
            background: newJob.token === 'zkLTC' ? '#1a1a0a' : 'transparent', color: newJob.token === 'zkLTC' ? '#ffd700' : '#888',
            borderRadius: 8, cursor: 'pointer',
          }}>
          zkLTC (Native)
        </button>
        <button
          onClick={() => update({ token: 'USDC' })}
          style={{
            flex: 1, padding: '10px 0', fontSize: 14, fontWeight: 700, border: newJob.token === 'USDC' ? '2px solid #2775ca' : '2px solid #444',
            background: newJob.token === 'USDC' ? '#0a1a2e' : 'transparent', color: newJob.token === 'USDC' ? '#2775ca' : '#888',
            borderRadius: 8, cursor: 'pointer',
          }}>
          USDC
        </button>
      </div>

      <input placeholder="Job Title" value={newJob.title} onChange={e => update({ title: e.target.value })} style={{ width: '100%', background: '#000', border: '1px solid #444', padding: 13, color: '#fff', marginBottom: 14, fontSize: 15, boxSizing: 'border-box' }} />
      <textarea placeholder="Job Description" value={newJob.description} onChange={e => update({ description: e.target.value })} style={{ width: '100%', background: '#000', border: '1px solid #444', padding: 13, color: '#fff', marginBottom: 14, fontSize: 15, minHeight: 80, boxSizing: 'border-box', resize: 'none' }} />
      <textarea placeholder="Requirements (CPU/GPU/RAM)" value={newJob.requirements} onChange={e => update({ requirements: e.target.value })} style={{ width: '100%', background: '#000', border: '1px solid #444', padding: 13, color: '#fff', marginBottom: 14, fontSize: 15, minHeight: 80, boxSizing: 'border-box', resize: 'none' }} />
      <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Job Type</div>
          <select
            value={newJob.type}
            onChange={e => update({ type: e.target.value })}
            style={{ width: '100%', background: '#000', border: '1px solid #444', padding: 13, color: '#fff', boxSizing: 'border-box' }}>
            <option value="ML">Machine Learning</option>
            <option value="ZK">Zero Knowledge Proof</option>
            <option value="Render">Video / 3D Render</option>
            <option value="AI Inference">AI Inference</option>
            <option value="AI Training">AI Training</option>
            <option value="Data Labeling">Data Labeling</option>
            <option value="Video Transcoding">Video Transcoding</option>
            <option value="Scientific">Scientific Simulation</option>
            <option value="RAG Pipeline">RAG Pipeline</option>
            <option value="FHE">FHE Computation</option>
            <option value="Custom">Custom</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Reward Amount ({tokenSymbol})</div>
          <input type="number" placeholder="e.g. 50" value={newJob.reward} onChange={e => update({ reward: parseInt(e.target.value) || 0 })} style={{ width: '100%', background: '#000', border: '1px solid #444', padding: 13, color: '#fff', boxSizing: 'border-box' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Number of Workers</div>
          <input type="number" min={1} max={100} placeholder="e.g. 3" value={newJob.maxWorkers} onChange={e => update({ maxWorkers: parseInt(e.target.value) || 0 })} style={{ width: '100%', background: '#000', border: '1px solid #444', padding: 13, color: '#fff', boxSizing: 'border-box' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Deadline</div>
          <input
            type="datetime-local"
            value={newJob.deadline}
            onChange={e => update({ deadline: e.target.value })}
            style={{ width: '100%', background: '#000', border: '1px solid #444', padding: 13, color: '#fff', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      <button onClick={onPost} disabled={loading} style={{ width: '100%', background: loading ? '#666' : tokenColor, color: '#000', border: 'none', padding: 16, fontSize: 16, fontWeight: 700, borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer' }}>
        {loading ? 'POSTING ON-CHAIN...' : `POST JOB (${newJob.reward * newJob.maxWorkers} ${tokenSymbol} total)`}
      </button>
      <div style={{ textAlign: 'center', marginTop: 10, fontSize: 12, opacity: 0.5 }}>
        Escrow: {newJob.reward} {tokenSymbol} &times; {newJob.maxWorkers} worker = {newJob.reward * newJob.maxWorkers} {tokenSymbol} ditahan di contract
      </div>
    </div>
  )
}
