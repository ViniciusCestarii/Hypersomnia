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
  key?: string
  value?: string
  enabled: boolean
}

export type Request = {
  url: string
  bodyType?: BodyType
  bodyContent?: string
  queryParameters: QueryParameters[]
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

export type CreateCollection = Omit<Collection, 'id'>
