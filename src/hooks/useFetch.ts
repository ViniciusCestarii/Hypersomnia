import { useState, useEffect, useCallback } from 'react'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

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

const customAxios = axios.create()

customAxios.interceptors.request.use((config) => {
  config.headers['request-startTime'] = new Date().getTime()
  return config
})

customAxios.interceptors.response.use((response) => {
  const currentTime = new Date().getTime()
  const startTime = response.config.headers['request-startTime']
  response.headers['request-duration'] = currentTime - startTime
  return response
})

const useFetch = <T>({
  url,
  options,
  enabled = true,
}: UseFetchProps): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [response, setResponse] = useState<AxiosResponse<T> | null>(null)

  const fetchData = useCallback(async () => {
    if (!url || !options) {
      return
    }
    setLoading(true)
    try {
      const response = await customAxios(options)

      setTime(response.headers['request-duration'])
      setData(response.data)
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
