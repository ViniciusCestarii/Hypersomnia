export type Collection = {
  id: string
  title: string
  description: string
}

export type CreateCollection = Omit<Collection, 'id'>
