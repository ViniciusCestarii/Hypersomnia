import { useState, useEffect, useCallback } from 'react'
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

interface UseFetchResult<T> {
  data: T | null
  time: string | null
  response: AxiosResponse<T> | null
  error: Error | null
  loading: boolean
  refetch: () => Promise<void>
}

interface UseFetchProps {
  url?: string
  options?: AxiosRequestConfig
  enabled?: boolean
}

const calculateTimeTaken = (startTime: number) => {
  return (performance.now() - startTime).toFixed(0)
}

const useFetch = <T>({
  url,
  options,
  enabled = true,
}: UseFetchProps): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [error, setError] = useState<AxiosError | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [response, setResponse] = useState<AxiosResponse<T> | null>(null)

  const fetchData = useCallback(async () => {
    if (!url || !options) {
      return
    }
    setLoading(true)
    const startTime = performance.now()
    try {
      const response = await axios(options)

      setTime(calculateTimeTaken(startTime))
      setData(response.data)
      setResponse(response)
      setError(null)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setTime(calculateTimeTaken(startTime))
        setData(null)
        setResponse(err.response || null)
        setError(err)
      }
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
