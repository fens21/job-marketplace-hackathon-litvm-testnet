import { useCallback } from 'react'
import type { WorkerProfile } from '../types'

const PROFILES_KEY = 'zkcompute_profiles'

export function loadProfiles(): Record<string, WorkerProfile> {
  try {
    return JSON.parse(localStorage.getItem(PROFILES_KEY) || '{}')
  } catch {
    return {}
  }
}

export function saveProfile(worker: string, bio: string, skills: string[]) {
  const profiles = loadProfiles()
  profiles[worker.toLowerCase()] = {
    worker: worker.toLowerCase(),
    bio,
    skills,
    updatedAt: Date.now(),
  }
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles))
}

export function getProfile(worker: string): WorkerProfile | null {
  const profiles = loadProfiles()
  return profiles[worker.toLowerCase()] || null
}

export function useWorkerProfiles() {
  const loadAll = useCallback((): Record<string, WorkerProfile> => {
    return loadProfiles()
  }, [])

  return { loadAll, getProfile, saveProfile }
}
