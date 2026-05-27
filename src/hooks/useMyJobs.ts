import { useState, useEffect, useCallback } from 'react'
import { watchContractEvent } from 'wagmi/actions'
import type { Job, WorkerEvent } from '../types'
import { config, CONTRACT_ADDRESS } from '../config/chain'
import abi from '../abi/JobMarketplace.json'

const MYJOBS_KEY = 'zkcompute_myjobs'
const WORKER_KEY = 'zkcompute_workers'

// Hybrid load: prioritize on-chain, fallback to local cache
function loadMyJobs(address?: string): Job[] {
  if (!address) return []
  const addr = address.toLowerCase()

  try {
    const saved = localStorage.getItem(MYJOBS_KEY)
    if (saved) {
      const data = JSON.parse(saved)
      if (!Array.isArray(data) && data[addr]) {
        return data[addr]
      }
    }
    return []
  } catch (e) {
    console.error('Failed to load my jobs from cache:', e)
    return []
  }
}

export function saveWorkerEvent(status: 'claimed' | 'completed' | 'paid', job: Job, workerAddr?: string) {
  if (!workerAddr) return
  const events: WorkerEvent[] = JSON.parse(localStorage.getItem(WORKER_KEY) || '[]')
  events.push({ worker: workerAddr.toLowerCase(), jobId: job.id, title: job.title, reward: job.reward, tokenSymbol: job.tokenSymbol || 'zkLTC', status, time: Date.now() })
  localStorage.setItem(WORKER_KEY, JSON.stringify(events))
}

export function getLeaderboardLocal(): { worker: string; jobsClaimed: number; jobsPaid: number; totalEarned: number; earnedZkltc: number; earnedUsdc: number; points: number }[] {
  const events: WorkerEvent[] = JSON.parse(localStorage.getItem(WORKER_KEY) || '[]')
  const map = new Map<string, { jobsClaimed: Set<number>; jobsPaid: Set<number>; earnedZkltc: number; earnedUsdc: number }>()
  for (const e of events) {
    if (!map.has(e.worker)) map.set(e.worker, { jobsClaimed: new Set(), jobsPaid: new Set(), earnedZkltc: 0, earnedUsdc: 0 })
    const rec = map.get(e.worker)!
    if (e.status === 'claimed' || e.status === 'completed') rec.jobsClaimed.add(e.jobId)
    if (e.status === 'paid') {
      rec.jobsPaid.add(e.jobId)
      if (e.tokenSymbol === 'USDC') rec.earnedUsdc += e.reward
      else rec.earnedZkltc += e.reward
    }
  }
  return [...map.entries()]
    .map(([worker, rec]) => ({
      worker,
      jobsClaimed: rec.jobsClaimed.size,
      jobsPaid: rec.jobsPaid.size,
      totalEarned: rec.earnedZkltc + rec.earnedUsdc,
      earnedZkltc: rec.earnedZkltc,
      earnedUsdc: rec.earnedUsdc,
      points: rec.jobsClaimed.size * 10 + rec.jobsPaid.size * 25,
    }))
    .sort((a, b) => b.points - a.points)
}


export function useMyJobs(address: string | undefined, syncEnabled: boolean = true) {
  const [myJobs, setMyJobsState] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load cached data + sync with on-chain
  const refreshMyJobs = useCallback(async () => {
    if (!address || !syncEnabled) return

    setIsLoading(true)
    try {
      const cached = loadMyJobs(address)
      setMyJobsState(cached)

      // TODO: In future version, we will add real event listening and on-chain sync here
      // For now we keep hybrid approach with local cache as primary source
      // while preparing for full on-chain integration
    } catch (error) {
      console.error('Failed to refresh my jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }, [address, syncEnabled])

  // Initial load and address change
  useEffect(() => {
    refreshMyJobs()
  }, [refreshMyJobs])

  // Save to localStorage (cache only)
  useEffect(() => {
    if (!address || myJobs.length === 0) return
    const addr = address.toLowerCase()
    const currentData: Record<string, Job[]> = JSON.parse(localStorage.getItem(MYJOBS_KEY) || '{}')
    currentData[addr] = myJobs
    localStorage.setItem(MYJOBS_KEY, JSON.stringify(currentData))
  }, [myJobs, address])

  // Listen to blockchain events (Hybrid core)
  useEffect(() => {
    if (!address || !syncEnabled) return

    const unwatchClaimed = watchContractEvent(config, {
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi,
      eventName: 'JobClaimed',
      onLogs: () => refreshMyJobs(),
    })

    const unwatchDispute = watchContractEvent(config, {
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi,
      eventName: 'DisputeRaised',
      onLogs: () => refreshMyJobs(),
    })

    const unwatchResolved = watchContractEvent(config, {
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi,
      eventName: 'DisputeResolved',
      onLogs: () => refreshMyJobs(),
    })

    return () => {
      unwatchClaimed()
      unwatchDispute()
      unwatchResolved()
    }
  }, [address, syncEnabled, refreshMyJobs])

  const setMyJobs = useCallback((updater: Job[] | ((prev: Job[]) => Job[])) => {
    if (!address) return
    setMyJobsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      return next
    })
  }, [address])

  return { 
    myJobs, 
    setMyJobs, 
    refreshMyJobs,
    isLoading 
  }
}
