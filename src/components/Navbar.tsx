import type { Tab } from '../types'

export function Navbar({ tab, setTab, account, entered, balance, loading, showWalletMenu, setShowWalletMenu, onConnect, onDisconnect, onSwitchNetwork, isWrongNetwork }: {
  tab: Tab
  setTab: (t: Tab) => void
  account: string
  entered: boolean
  balance: { value: bigint; symbol: string } | undefined
  loading: boolean
  showWalletMenu: boolean
  setShowWalletMenu: (v: boolean) => void
  onConnect: () => void
  onDisconnect: () => void
  onSwitchNetwork: () => void
  isWrongNetwork: boolean
}) {
  return (
    <>
      <nav style={{ background: 'radial-gradient(ellipse at 30% 50%, #1a0033 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, #001a11 0%, transparent 60%), #000000', borderBottom: '1px solid #222', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, flexDirection: window.innerWidth < 700 ? 'column' : 'row' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 34, height: 34, background: '#ffd700', borderRadius: 6 }}></div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#ffd700', letterSpacing: -0.5 }}>zkCompute Hub</div>
            <div style={{ fontSize: 9, opacity: 0.4, display: 'flex', alignItems: 'center', gap: 6 }}>
              LITVM &bull; LITECOIN ROLLUP
              {entered && (
                <span style={{ background: isWrongNetwork ? '#ff6b6b' : '#1a3c1a', color: isWrongNetwork ? '#000' : '#4ade80', padding: '1px 8px', borderRadius: 10, fontSize: 9, fontWeight: 600 }}>
                  {isWrongNetwork ? 'WRONG NETWORK' : 'LITFORGE'}
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center', marginLeft: 'auto' }}>
          <TabButton active={tab === 'market'} onClick={() => setTab('market')} label="Marketplace" />
          <TabButton active={tab === 'post'} onClick={() => setTab('post')} label="Post Job" />
          <TabButton active={tab === 'my'} onClick={() => setTab('my')} label="My Jobs" />
          <TabButton active={tab === 'stats'} onClick={() => setTab('stats')} label="Stats" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 16 }}>
          {!account ? (
            <button onClick={onConnect} disabled={loading} style={{ background: '#ffd700', color: '#000', border: 'none', padding: '9px 18px', fontWeight: 700, borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          ) : (
            <>
              <div style={{ background: '#151515', border: '1px solid #333', padding: '8px 14px', borderRadius: 8, fontSize: 13, fontFamily: 'monospace' }}>
                {balance ? `${(Number(balance.value) / 1e18).toFixed(4)} ${balance.symbol}` : '0.0000 zkLTC'}
              </div>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowWalletMenu(!showWalletMenu)}
                  style={{ background: '#151515', color: '#fff', border: '1px solid #333', padding: '10px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 13, minWidth: 130, fontFamily: 'monospace' }}>
                  {account.slice(0, 6)}...{account.slice(-4)}
                </button>
                {showWalletMenu && (
                  <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 4, background: '#111', border: '1px solid #333', borderRadius: 8, minWidth: 140, zIndex: 100, overflow: 'hidden' }}>
                    <button
                      onClick={() => { setTab('profile'); setShowWalletMenu(false); }}
                      style={{ width: '100%', background: 'transparent', color: '#e0e0e0', border: 'none', padding: '10px 18px', textAlign: 'left', cursor: 'pointer', fontSize: 13, fontFamily: 'monospace' }}>
                      Profile
                    </button>
                    <button
                      onClick={onDisconnect}
                      style={{ width: '100%', background: 'transparent', color: '#ff6b6b', border: 'none', padding: '10px 18px', textAlign: 'left', cursor: 'pointer', fontSize: 13, fontFamily: 'monospace' }}>
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </nav>

      {isWrongNetwork && (
        <div style={{ background: '#ff6b6b', color: '#000', padding: '12px 24px', textAlign: 'center', fontWeight: 600, fontSize: 14, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
          Wrong network! Please switch to LitForge Testnet (Chain ID 4441)
          <button onClick={onSwitchNetwork} style={{ background: '#000', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>
            SWITCH NETWORK
          </button>
        </div>
      )}
    </>
  )
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} style={{
      background: active ? '#1a1a1a' : 'transparent',
      border: active ? '1px solid #444' : '1px solid transparent',
      padding: '8px 16px',
      color: active ? '#e0e0e0' : '#888',
      cursor: 'pointer',
      fontSize: 13,
      borderRadius: 8,
      fontWeight: active ? 600 : 400,
      transition: 'all 0.15s',
    }}>
      {label}
    </button>
  )
}
