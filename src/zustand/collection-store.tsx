import { create } from 'zustand'
import { Collection, CreateCollection } from '../types/collection'

type CollectionStore = {
  collections: Collection[]
  selectedCollection: Collection | null
  createCollection: (newCollection: CreateCollection) => void
  selectCollection: (collectionId: string | null) => void
  deleteCollection: (collectionId: string) => void
  updateCollections: (collections: Collection[]) => void
}

const testColection = [
  {
    id: '7a73781d-5904-4aac-9c5a-c030f111885a',
    title: 'Collection 1',
    description: 'Description 1',
  },
  {
    id: '393c157c-7f3d-47f3-9a28-bd10f1ec563a',
    title: 'Collection 2',
    description: 'Description 2',
  },
  {
    id: '5156631e-0697-408a-ac80-654b990026f2',
    title: 'Collection 3',
    description: 'Description 3',
  },
  {
    id: '8299fb46-68c8-4c99-8cd5-936b5158de68',
    title: 'Collection 4',
    description: 'Description 4',
  },
  {
    id: '50a98039-b705-4879-8c44-e0ebcbb063ab',
    title: 'Collection 5',
    description: 'Description 5',
  },
  {
    id: '74148c7b-2cbc-4593-aa2e-0d821b8aa1fb',
    title: 'Collection 2',
    description: 'Description 2',
  },
]

const useCollectionStore = create<CollectionStore>((set) => ({
  selectedProject: null,
  collections: testColection,
  selectedCollection: null,
  createCollection: (newCollection) =>
    set((state) => {
      const newCollectionWithId = {
        ...newCollection,
        id: state.collections.length.toString(),
      }

      return {
        collections: [...state.collections, newCollectionWithId],
      }
    }),
  selectCollection: (collectionId) => {
    set((state) => ({
      selectedCollection: state.collections.find(
        (collection) => collection.id === collectionId,
      ),
    }))
  },
  updateCollections: (collections) => set({ collections }),
  deleteCollection: (collectionId) =>
    set((state) => ({
      collections: state.collections.filter(
        (collection) => collection.id !== collectionId,
      ),
    })),
}))

export default useCollectionStore
