import { copyRequestAsCurl } from '@/lib/export'
import { getCookies } from '@/lib/utils'
import { HypersomniaRequest } from '@/types'
import useHypersomniaStore from '@/zustand/hypersomnia-store'
import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { useCallback, useEffect, useRef } from 'react'
import { toast } from 'sonner'

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
  const request = useHypersomniaStore((state) => state.selectedRequest!)
  // todo: add option to enable withCredentials to allow cookies to be sent with the request
  const setCookies = useHypersomniaStore((state) => state.setCookies)
  const latestRequestRef = useRef(0)

  const fetchData = async () => {
    if (!url || !options) {
      return
    }

    const requestId = ++latestRequestRef.current
    setRequestFetchResult({ ...requestFetchResult, loading: true })
    const requestStartTime = new Date().getTime()

    try {
      const response = await customAxios(options)
      const timeTaken =
        response.headers['request-finish-time'] - requestStartTime
      delete response.headers['request-finish-time']
      const isLatestRequest = requestId === latestRequestRef.current

      if (isLatestRequest) {
        setRequestFetchResult({
          data: response.data,
          error: null,
          loading: false,
          response,
          timeTaken,
          requestStartTime,
        })
      }
    } catch (err) {
      console.error('Request err:', err)
      const isLatestRequest = requestId === latestRequestRef.current

      if (axios.isAxiosError(err)) {
        toastError(err, request)
        const timeTaken =
          err.response?.headers['request-finish-time'] - requestStartTime
        delete err.response?.headers['request-finish-time']

        if (isLatestRequest) {
          setRequestFetchResult({
            data: err.response?.data ?? null,
            error: err,
            loading: false,
            response: err.response ?? null,
            timeTaken: Number.isNaN(timeTaken) ? null : timeTaken,
            requestStartTime,
          })
        }
      } else if (isLatestRequest) {
        console.log('Err:', err)
        setRequestFetchResult({
          data: null,
          error: err as Error,
          loading: false,
          response: null,
          timeTaken: null,
          requestStartTime,
        })
      }
    } finally {
      const isLatestRequest = requestId === latestRequestRef.current
      if (isLatestRequest) {
        setCookies(getCookies())
      }
    }
  }

  useEffect(() => {
    if (enabled) {
      fetchData()
    }
  })

  return fetchData
}

export default useFetch

const toastError = (error: AxiosError, request: HypersomniaRequest) => {
  if (error?.message === 'Network Error') {
    toast.error('Network Error', {
      description:
        'This could be due to CORS policy, network connection, bad DNS, or others issues. Try to copy as curl and run it in your terminal.',
      action: {
        label: 'Copy as Curl',
        onClick: () => copyRequestAsCurl(request),
      },
    })
  }
}
