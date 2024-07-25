/* eslint-disable no-use-before-define */
export type FileSystemNode = {
  name: string
  children?: FileSystemNode[]
  isFolder: boolean
  request?: Request
}

export type MethodType =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'OPTIONS'
  | 'HEAD'
  | 'CONNECT'
  | 'TRACE'

type OverrideRequestInit = {
  method: MethodType
}

export type Request = {
  id: string
  url: string
  options: RequestInit & OverrideRequestInit
}

export type Collection = {
  id: string
  title: string
  description: string
  fileSystem: FileSystemNode[]
}

export type CreateCollection = Omit<Collection, 'id'>
