import { Collection } from './collection'

export type Project = {
  id: string
  title: string
  description: string
  collections: Collection[]
}

export type CreateProject = Omit<Project, 'id'>
