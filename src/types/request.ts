import { AxiosRequestConfig, AxiosResponse } from 'axios'

export type MethodType =
  | 'get'
  | 'post'
  | 'put'
  | 'delete'
  | 'patch'
  | 'options'
  | 'head'

export type BodyTypeStructured = 'form-data' | 'x-www-form-urlencoded'

export type BodyTypeText = 'json' | 'xml' | 'yaml' | 'edn' | 'plain-text'

export type BodyTypeOther = 'file' | 'none'

export type BodyType = BodyTypeStructured | BodyTypeText | BodyTypeOther

type OverrideAxiosRequestConfig = {
  method: MethodType
}

export type RequestQueryParameters = {
  id: string
  key?: string
  value?: string
  enabled: boolean
}

export type RequestHeaders = {
  id: string
  key?: string
  value?: string
  enabled: boolean
}

export type AuthType = 'basic' | 'bearer token' | 'none'

export type AuthBasic = {
  username?: string
  password?: string
}

export type AuthBearerToken = {
  prefix?: string
  token?: string
}

export type RequestAuth = {
  type: AuthType
  enabled: boolean
  data?: AuthBasic | AuthBearerToken
}

export type RequestBody = {
  type: BodyType
  content: string
}

export type RequestOptions = AxiosRequestConfig & OverrideAxiosRequestConfig

export type HypersomniaRequest = {
  url: string
  body?: RequestBody
  auth?: RequestAuth
  doc?: string
  queryParameters?: RequestQueryParameters[]
  headers?: RequestHeaders[]
  options: RequestOptions
}

export type RequestFetchResult = {
  data?: unknown
  timeTaken?: number | null
  requestStartTime?: number | null
  response?: AxiosResponse<unknown> | null
  error?: Error | null
  loading?: boolean
}

export type Cookie = {
  name: string
  value: string
}
