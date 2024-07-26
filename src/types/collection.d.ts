import { AxiosRequestConfig } from 'axios'

/* eslint-disable no-use-before-define */
export type FileSystemNode = {
  name: string
  children?: FileSystemNode[]
  isFolder: boolean
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
  | 'connect'
  | 'trace'

type OverrideAxiosRequestConfig = {
  method: MethodType
}

export type QueryParameters = {
  key?: string
  value?: string
  enabled: boolean
}

export type Request = {
  id: string
  url: string
  queryParameters: QueryParameters[]
  options: AxiosRequestConfig & OverrideAxiosRequestConfig
}

export type Collection = {
  id: string
  title: string
  description: string
  fileSystem: FileSystemNode[]
}

export type CreateCollection = Omit<Collection, 'id'>
