import { useState, useEffect, useCallback } from 'react'
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { RequestFetchResult } from '@/types/collection'
import useHypersomniaStore from '@/zustand/hypersomnia-store'
interface UseFetchProps {
  url?: string
  options?: AxiosRequestConfig
  enabled?: boolean
}

const calculateTimeTaken = (startTime: number) => {
  return (performance.now() - startTime).toFixed(0)
}

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

    const startTime = performance.now()
    try {
      const response = await axios(options)
      setRequestFetchResult({
        data: response.data,
        error: null,
        loading: false,
        response,
        time: calculateTimeTaken(startTime),
      })
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setRequestFetchResult({
          data: null,
          error: err,
          loading: false,
          response: err.response || null,
          time: calculateTimeTaken(startTime),
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
