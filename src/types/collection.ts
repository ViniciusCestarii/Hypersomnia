import { HypersomniaRequest } from './request'

/* eslint-disable no-use-before-define */
export type FileSystemNode = {
  id: string
  name: string
  children?: FileSystemNode[]
  isFolder?: boolean
  isOpen?: boolean
  request?: HypersomniaRequest
}

export type FileSystemNodeRequest = FileSystemNode & {
  request: HypersomniaRequest
}

export type Collection = {
  id: string
  title: string
  description: string
  fileSystem: FileSystemNode[]
}

export type CreateCollection = Omit<Collection, 'id'>
