import { AxiosRequestConfig } from 'axios'

/* eslint-disable no-use-before-define */
export type FileSystemNode = {
  name: string
  children?: FileSystemNode[]
  isFolder?: boolean
  request?: Request
}

export type MethodType =
  | 'get'
  | 'post'
  | 'put'
  | 'delete'
  | 'patch'
  | 'options'
  | 'head'

export type BodyTypeStructured = 'form-data' | 'x-www-form-urlencoded'

export type BodyTypeText = 'json' | 'xml' | 'yaml' | 'plain-text'

export type BodyTypeOther = 'file' | 'none'

export type BodyType = BodyTypeStructured | BodyTypeText | BodyTypeOther

type OverrideAxiosRequestConfig = {
  method: MethodType
}

export type QueryParameters = {
  id: string
  key?: string
  value?: string
  enabled: boolean
}

export type Headers = {
  key: string
  value: string
  enabled: boolean
}

type AuthType = 'basic' | 'bearer token' | 'none'

type AuthBasic = {
  username?: string
  password?: string
}

type AuthBearerToken = {
  prefix?: string
  token?: string
}

type Auth = {
  type: AuthType
  enabled: boolean
  data?: AuthBasic | AuthBearerToken
}

export type Request = {
  url: string
  bodyType?: BodyType
  bodyContent?: string
  auth?: Auth
  doc?: string
  queryParameters?: QueryParameters[]
  headers?: Headers[]
  options: AxiosRequestConfig & OverrideAxiosRequestConfig
}

export type Collection = {
  id: string
  title: string
  description: string
  fileSystem: FileSystemNode[]
}

export type RequestFetchResult = {
  data?: unknown | null
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

export type CreateCollection = Omit<Collection, 'id'>
