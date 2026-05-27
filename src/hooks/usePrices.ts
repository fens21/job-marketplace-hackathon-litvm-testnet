import { useState, useEffect } from 'react'

export function usePrices() {
  const [ltcPrice, setLtcPrice] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    const fetchPrice = async () => {
      setLoading(true)
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd')
        const data = await res.json() as { litecoin?: { usd?: number } }
        if (!cancelled && data.litecoin?.usd) {
          setLtcPrice(data.litecoin.usd)
        }
      } catch (e) {
        console.error('Failed to fetch LTC price:', e)
      }
      if (!cancelled) setLoading(false)
    }
    fetchPrice()
    return () => { cancelled = true }
  }, [])

  return { ltcPrice, loading }
}
