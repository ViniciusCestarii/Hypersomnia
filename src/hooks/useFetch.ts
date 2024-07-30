import useHypersomniaStore from '@/zustand/hypersomnia-store'
import axios, { AxiosRequestConfig } from 'axios'
import { useCallback, useEffect } from 'react'
interface UseFetchProps {
  url?: string
  options?: AxiosRequestConfig
  enabled?: boolean
}

const calculateTimeTaken = (startTime: number) => {
  return (new Date().getTime() - startTime).toFixed(0)
}

const customAxios = axios.create()

customAxios.interceptors.request.use((config) => {
  config.headers['request-startTime'] = new Date().getTime()
  return config
})

customAxios.interceptors.response.use(
  (response) => {
    const startTime = response.config.headers['request-startTime']
    response.headers['request-duration'] = calculateTimeTaken(startTime)
    response.headers['request-startTime'] = startTime
    return response
  },
  (error) => {
    const startTime = error.config?.headers['request-startTime']
    if (startTime) {
      error.response.headers['request-duration'] = calculateTimeTaken(startTime)
      error.response.headers['request-startTime'] = startTime
    }
    return Promise.reject(error)
  },
)

const useFetch = ({ url, options, enabled = true }: UseFetchProps) => {
  const setRequestFetchResult = useHypersomniaStore(
    (state) => state.setRequestFetchResult,
  )
  const requestFetchResult = useHypersomniaStore(
    (state) => state.requestFetchResult,
  )

  const fetchData = useCallback(async () => {
    if (!url || !options) {
      return
    }
    setRequestFetchResult({ ...requestFetchResult, loading: true })

    try {
      const response = await customAxios(options)
      const timeTaken = response.headers['request-duration']
      const requestStartTime = response.headers['request-startTime']
      delete response.headers['request-duration']
      delete response.headers['request-startTime']
      setRequestFetchResult({
        data: response.data,
        error: null,
        loading: false,
        response,
        timeTaken,
        requestStartTime,
      })
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const timeTaken = err.response?.headers['request-duration']
        const requestStartTime = err.response?.headers['request-startTime']
        delete err.response?.headers['request-duration']
        delete err.response?.headers['request-startTime']
        setRequestFetchResult({
          data: null,
          error: err,
          loading: false,
          response: err.response || null,
          timeTaken,
          requestStartTime,
        })
      }
    }
  }, [url, options, setRequestFetchResult, requestFetchResult])

  useEffect(() => {
    if (enabled) {
      fetchData()
    }
  }, [fetchData, enabled])

  return fetchData
}

export default useFetch
