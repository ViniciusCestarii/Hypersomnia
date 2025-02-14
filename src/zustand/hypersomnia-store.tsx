import {
  findSystemNodeByPath,
  insertFile,
  insertFileNextToPath,
  removeFileInFileSystem,
  updateFileInFileSystem,
  updateRequestInFileSystem,
} from '@/lib/utils'
import {
  Collection,
  Cookie,
  FileSystemNode,
  HypersomniaRequest,
  RequestFetchResult,
} from '@/types'
import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { initialCollections } from './initial-data'

type HypersomniaStore = {
  collections: Collection[]
  isReady: boolean
  setIsReady: (isReady: boolean) => void
  selectedCollection: Collection | null
  createCollection: (collection: Collection) => void
  deleteCollection: (id: Collection['id']) => void
  updateCollection: (collection: Collection) => void
  updateCollectionById: (id: Collection['id'], collection: Collection) => void
  selectCollection: (id: string) => void
  selectedRequestPath: string[] | null
  selectedRequestPathString: string | null
  selectedRequest: HypersomniaRequest | null
  sendTrigger: boolean | undefined
  requestFetchResult: RequestFetchResult | null
  createFileSystemNode: (file: FileSystemNode, path?: string[]) => void
  duplicateFileSystemNode: (file: FileSystemNode, path: string[]) => void
  setRequestFetchResult: (requestFetchResult: RequestFetchResult | null) => void
  selectRequest: (path: string[]) => void
  sendRequest: () => void
  updateSelectedRequest: (request: HypersomniaRequest) => void
  updateRequestField: (field: string, value: unknown) => void
  updateRequestOptionField: (
    field: keyof HypersomniaRequest['options'],
    value: unknown,
  ) => void
  updateFile: (path: string[], updatedNode: FileSystemNode) => void
  deleteFile: (path: string[]) => void
  cookies: Cookie[]
  setCookies: (cookies: Cookie[]) => void
}

const hypersomniaStateCreator: StateCreator<HypersomniaStore> = (set) => ({
  isReady: false,
  collections: initialCollections,
  selectedCollection: null,
  selectedRequest: null,
  selectedRequestPath: null,
  selectedRequestPathString: null,
  setIsReady: (isReady) => set({ isReady }),
  createCollection: (collection) =>
    set((state) => {
      const updatedCollections = [...state.collections, collection]
      return {
        collections: updatedCollections.toSorted((a, b) =>
          a.id.localeCompare(b.id),
        ),
      }
    }),
  deleteCollection: (id) =>
    set((state) => {
      const updatedCollections = state.collections.filter(
        (collection) => collection.id !== id,
      )

      const selectedCollection =
        state.selectedCollection?.id === id ? null : state.selectedCollection

      return {
        collections: updatedCollections,
        selectedCollection,
      }
    }),
  selectCollection: (id) =>
    set((state) => {
      const selectedCollection = state.collections.find(
        (collection) => collection.id === id,
      )
      return { selectedCollection }
    }),
  updateCollection: (collection) =>
    set((state) => {
      const updatedCollections = state.collections.map((coll) =>
        coll.id === collection.id ? collection : coll,
      )

      return {
        collections: updatedCollections,
        selectedCollection: collection,
      }
    }),
  updateCollectionById: (id, updatedCollection) =>
    set((state) => {
      const updatedCollections = state.collections.map((coll) =>
        coll.id === id ? updatedCollection : coll,
      )

      return {
        collections: updatedCollections,
        selectedCollection:
          state.selectedCollection?.id === id
            ? updatedCollection
            : state.selectedCollection,
      }
    }),
  selectRequest: (path) => {
    set((state) => {
      if (!path.length)
        return {
          selectedRequest: null,
          selectedRequestPath: null,
          selectedRequestPathString: null,
        }
      if (!state.selectedCollection) return state
      const selectedRequest =
        findSystemNodeByPath(state.selectedCollection?.fileSystem, path)
          ?.request ?? null

      return {
        selectedRequest,
        selectedRequestPath: path,
        selectedRequestPathString: path.join('/'),
      }
    })
  },
  cookies: [],
  setCookies: (cookies) => set({ cookies }),
  requestFetchResult: null,
  sendTrigger: undefined,
  sendRequest: () =>
    set((state) => ({
      sendTrigger: !state.sendTrigger,
    })),
  setRequestFetchResult: (requestFetchResult) => set({ requestFetchResult }),
  createFileSystemNode: (file, path) =>
    set((state) => {
      const { selectedCollection } = state
      if (!selectedCollection) return state

      const updatedFileSystem = insertFile(
        selectedCollection.fileSystem,
        path ?? [],
        file,
      )

      const updatedCollection = {
        ...selectedCollection,
        fileSystem: updatedFileSystem,
      }

      const updatedCollections = state.collections.map((collection) =>
        collection.id === selectedCollection.id
          ? updatedCollection
          : collection,
      )

      return {
        collections: updatedCollections,
        selectedCollection: updatedCollection,
      }
    }),
  duplicateFileSystemNode: (duplicatedFile, originalPath) =>
    set((state) => {
      const { selectedCollection } = state
      if (!selectedCollection) return state

      const updatedFileSystem = insertFileNextToPath(
        selectedCollection.fileSystem,
        originalPath,
        duplicatedFile,
      )

      const updatedCollection = {
        ...selectedCollection,
        fileSystem: updatedFileSystem,
      }

      const updatedCollections = state.collections.map((collection) =>
        collection.id === selectedCollection.id
          ? updatedCollection
          : collection,
      )

      return {
        collections: updatedCollections,
        selectedCollection: updatedCollection,
      }
    }),
  updateFile: (path, updatedNode) =>
    set((state) => {
      const { selectedCollection } = state
      if (!selectedCollection) return state

      const updatedFileSystem = updateFileInFileSystem(
        selectedCollection.fileSystem,
        path,
        updatedNode,
      )

      const updatedCollection = {
        ...selectedCollection,
        fileSystem: updatedFileSystem,
      }

      const updatedCollections = state.collections.map((collection) =>
        collection.id === selectedCollection.id
          ? updatedCollection
          : collection,
      )

      return {
        collections: updatedCollections,
        selectedCollection: updatedCollection,
      }
    }),
  deleteFile: (path) =>
    set((state) => {
      const { selectedCollection } = state
      if (!selectedCollection) return state

      const updatedFileSystem = removeFileInFileSystem(
        selectedCollection.fileSystem,
        path,
      )

      const updatedCollection = {
        ...selectedCollection,
        fileSystem: updatedFileSystem,
      }

      const updatedCollections = state.collections.map((collection) =>
        collection.id === selectedCollection.id
          ? updatedCollection
          : collection,
      )

      const isDeletingSelectedRequest = state.selectedRequestPath?.some(
        (selectedRequestSegment) => {
          const fileIdToBeDeleted = path[path.length - 1]
          return selectedRequestSegment === fileIdToBeDeleted
        },
      )

      return {
        collections: updatedCollections,
        selectedCollection: updatedCollection,
        selectedRequest: isDeletingSelectedRequest
          ? null
          : state.selectedRequest,
        selectedRequestPath: isDeletingSelectedRequest
          ? null
          : state.selectedRequestPath,
        selectedRequestPathString: isDeletingSelectedRequest
          ? null
          : state.selectedRequestPathString,
      }
    }),
  updateSelectedRequest: (updatedRequest) =>
    set((state) => {
      const { selectedRequestPath, selectedCollection } = state
      if (!selectedRequestPath || !selectedCollection) return state

      const updatedFileSystem = updateRequestInFileSystem(
        selectedCollection.fileSystem,
        selectedRequestPath,
        updatedRequest,
      )

      const updatedCollection = {
        ...selectedCollection,
        fileSystem: updatedFileSystem,
      }

      const updatedCollections = state.collections.map((collection) =>
        collection.id === selectedCollection.id
          ? updatedCollection
          : collection,
      )

      return {
        collections: updatedCollections,
        selectedCollection: updatedCollection,
        selectedRequest: updatedRequest,
      }
    }),
  updateRequestField: (field, value) =>
    set((state) => {
      const { selectedRequest } = state
      if (!selectedRequest) return state

      const keys = field.split('.')
      const lastKey = keys.pop()
      if (!lastKey) {
        throw new Error('Invalid field')
      }
      const nestedObject = keys.reduce((obj: any, key) => {
        if (!obj[key]) obj[key] = {}
        return obj[key]
      }, selectedRequest)

      nestedObject[lastKey] = value

      state.updateSelectedRequest({ ...selectedRequest })
      return {}
    }),
  updateRequestOptionField: (field, value) =>
    set((state) => {
      const { selectedRequest } = state
      if (!selectedRequest) return state

      const updatedRequest = {
        ...selectedRequest,
        options: {
          ...selectedRequest.options,
          [field]: value,
        },
      }

      state.updateSelectedRequest(updatedRequest)
      return {}
    }),
})

const keysToIgnore = ['sendTrigger', 'cookies']

export const useHypersomniaStore = create<HypersomniaStore>()(
  persist(hypersomniaStateCreator, {
    name: 'hypersomnia-store',
    partialize: (state) =>
      Object.fromEntries(
        Object.entries(state).filter(([key]) => !keysToIgnore.includes(key)),
      ),
  }),
)

export default useHypersomniaStore
