import { useState, useEffect, useCallback, useRef } from 'react'
import { readContract } from '@wagmi/core'
import abi from '../abi/JobMarketplace.json'
import { config, CONTRACT_ADDRESS } from '../config/chain'
import type { Job } from '../types'

const DEMO_JOBS: Job[] = [
  { id: -1, title: "MNIST Inference", type: "ML", reward: 45, deadline: "2h", description: "Run inference on MNIST model with 10k samples", requirements: "GPU 8GB+, Python 3.10, PyTorch", poster: "0xA1b2...c3D4", claimedCount: 2, maxWorkers: 5, difficulty: "Medium", tokenSymbol: 'zkLTC' },
  { id: -2, title: "zkSNARK Generation", type: "ZK", reward: 120, deadline: "6h", description: "Generate zkSNARK proof for 500k transactions", requirements: "64GB RAM, circom 2.0, 16 cores", poster: "0xE5f6...g7H8", claimedCount: 0, maxWorkers: 3, difficulty: "Hard", tokenSymbol: 'zkLTC' },
  { id: -3, title: "Video Render 4K", type: "Render", reward: 80, deadline: "12h", description: "Render 30s 4K animation using Blender", requirements: "RTX 4090 / equivalent, 32GB RAM", poster: "0xI9j0...k1L2", claimedCount: 1, maxWorkers: 4, difficulty: "Medium", tokenSymbol: 'zkLTC' },
  { id: -4, title: "Llama-3 Inference", type: "AI Inference", reward: 95, deadline: "3h", description: "Run large scale inference on Llama-3 70B", requirements: "A100 / H100, 80GB VRAM, vLLM", poster: "0xK3m4...n5P6", claimedCount: 1, maxWorkers: 2, difficulty: "Hard", tokenSymbol: 'zkLTC' },
  { id: -5, title: "Stable Diffusion Batch", type: "AI Training", reward: 150, deadline: "8h", description: "Fine-tune SDXL on custom dataset", requirements: "4x RTX 4090, 24GB VRAM each, PyTorch", poster: "0xQ7r8...s9T0", claimedCount: 0, maxWorkers: 1, difficulty: "Hard", tokenSymbol: 'zkLTC' },
  { id: -6, title: "Protein Folding Simulation", type: "Scientific", reward: 200, deadline: "24h", description: "Run AlphaFold2 on 500 protein sequences", requirements: "NVIDIA A100, 40GB, CUDA 12.0", poster: "0xU1v2...w3X4", claimedCount: 0, maxWorkers: 3, difficulty: "Expert", tokenSymbol: 'zkLTC' },
  { id: -7, title: "Large Scale Data Labeling", type: "Data Labeling", reward: 60, deadline: "5h", description: "Label 100k images for autonomous driving dataset", requirements: "Basic GPU, Python, LabelStudio", poster: "0xY5z6...a7B8", claimedCount: 3, maxWorkers: 8, difficulty: "Medium", tokenSymbol: 'zkLTC' },
  { id: -8, title: "Video Transcoding AV1", type: "Video Transcoding", reward: 75, deadline: "4h", description: "Transcode 200 videos to AV1 format", requirements: "FFmpeg, NVIDIA NVENC, 16 cores", poster: "0xC9d0...e1F2", claimedCount: 1, maxWorkers: 4, difficulty: "Medium", tokenSymbol: 'zkLTC' },
  { id: -9, title: "RAG Pipeline Optimization", type: "RAG Pipeline", reward: 110, deadline: "6h", description: "Build and optimize RAG system for enterprise docs", requirements: "LangChain, Vector DB, GPU", poster: "0xG3h4...i5J6", claimedCount: 0, maxWorkers: 2, difficulty: "Hard", tokenSymbol: 'zkLTC' },
  { id: -10, title: "FHE Encrypted Computation", type: "FHE", reward: 180, deadline: "10h", description: "Run encrypted ML inference using FHE", requirements: "Microsoft SEAL, 128GB RAM", poster: "0xK7l8...m9N0", claimedCount: 0, maxWorkers: 1, difficulty: "Expert", tokenSymbol: 'zkLTC' },
]

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

function parseJob(raw: [bigint, string, string, bigint, string, string, bigint, bigint, boolean]): Job {
  const tokenAddr = (raw[4] as string).toLowerCase()
  const isNative = tokenAddr === ZERO_ADDRESS.toLowerCase()
  const decimals = isNative ? 18 : 6
  const rewardNum = Number(raw[3]) / 10 ** decimals
  const tokenSymbol = isNative ? 'zkLTC' : 'USDC'
  const difficulty = rewardNum >= 150 ? 'Expert' : rewardNum >= 80 ? 'Hard' : 'Medium'
  return {
    id: Number(raw[0]),
    title: raw[1],
    type: raw[2],
    reward: rewardNum,
    deadline: 'N/A',
    description: `${raw[2]} job — ${rewardNum} ${tokenSymbol} reward`,
    requirements: `Posted by ${(raw[5] as string).slice(0, 6)}...`,
    poster: raw[5] as string,
    claimedCount: Number(raw[7]),
    maxWorkers: Number(raw[6]),
    difficulty,
    tokenSymbol,
  }
}

export function useJobs(autoFetch: boolean) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [onChainJobs, setOnChainJobs] = useState<Job[]>([])
  const hasFetched = useRef(false)

  const fetchOnChainJobs = useCallback(async () => {
    if (hasFetched.current) return
    hasFetched.current = true
    try {
      const count = await readContract(config, {
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi,
        functionName: 'jobCount',
      }) as bigint

      const onChain: Job[] = []
      for (let i = 1; i <= Number(count); i++) {
        try {
          const job = await readContract(config, {
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi,
            functionName: 'jobs',
            args: [BigInt(i)],
          }) as [bigint, string, string, bigint, string, string, bigint, bigint, boolean]

          if (job[8]) {
            onChain.push(parseJob(job))
          }
        } catch (e) {
          console.error(`Failed to fetch on-chain job #${i}:`, e)
        }
      }
      setOnChainJobs(Object.values(Object.fromEntries(onChain.map(j => [String(j.id), j]))))
      setJobs(Object.values(Object.fromEntries([...onChain, ...DEMO_JOBS].map(j => [String(j.id), j]))))
    } catch (e) {
      console.error('Failed to fetch on-chain jobs:', e)
    }
  }, [])

  useEffect(() => {
    if (autoFetch) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchOnChainJobs()
    }
  }, [autoFetch, fetchOnChainJobs])

  return { jobs, setJobs, onChainJobs }
}
