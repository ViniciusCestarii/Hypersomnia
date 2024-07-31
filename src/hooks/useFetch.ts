import useHypersomniaStore from '@/zustand/hypersomnia-store'
import axios, { AxiosRequestConfig } from 'axios'
import { useCallback, useEffect } from 'react'
interface UseFetchProps {
  url?: string
  options?: AxiosRequestConfig
  enabled?: boolean
}

const customAxios = axios.create()

customAxios.interceptors.response.use(
  (response) => {
    response.headers['request-finish-time'] = new Date().getTime()
    return response
  },
  (error) => {
    if (error.response) {
      error.response.headers['request-finish-time'] = new Date().getTime()
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
    const requestStartTime = new Date().getTime()

    try {
      const response = await customAxios(options)
      const timeTaken =
        response.headers['request-finish-time'] - requestStartTime
      delete response.headers['request-finish-time']
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
        console.log(err)
        const timeTaken =
          err.response?.headers['request-finish-time'] - requestStartTime
        delete err.response?.headers['request-finish-time']

        setRequestFetchResult({
          data: err.response?.data ?? null,
          error: err,
          loading: false,
          response: err.response ?? null,
          timeTaken: Number.isNaN(timeTaken) ? null : timeTaken,
          requestStartTime,
        })
      } else {
        setRequestFetchResult({
          data: null,
          error: err as Error,
          loading: false,
          response: null,
          timeTaken: null,
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
