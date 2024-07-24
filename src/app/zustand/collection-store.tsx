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

const useCollectionStore = create<CollectionStore>((set) => ({
  selectedProject: null,
  collections: [],
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
