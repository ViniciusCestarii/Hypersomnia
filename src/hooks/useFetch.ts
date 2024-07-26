import { useState, useEffect, useCallback } from 'react'

interface UseFetchResult<T> {
  data: T | null
  time: string | null
  response: Response | null
  error: Error | null
  loading: boolean
  refetch: () => Promise<void>
}

interface UseFetchProps {
  url?: string
  options?: RequestInit
  enabled?: boolean
}

const useFetch = <T>({
  url,
  options,
  enabled = true,
}: UseFetchProps): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [response, setResponse] = useState<Response | null>(null)

  const fetchData = useCallback(async () => {
    if (!url) {
      return
    }
    setLoading(true)
    try {
      const initialTime = performance.now()
      const response = await fetch(url, options)
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }
      const finalTime = performance.now() - initialTime - 1
      const result: T = await response.json()

      setTime(finalTime.toFixed(0))
      setData(result)
      setResponse(response)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [url, options])

  useEffect(() => {
    if (enabled) {
      fetchData()
    }
  }, [fetchData, enabled])

  return { data, error, loading, response, time, refetch: fetchData }
}

export default useFetch
