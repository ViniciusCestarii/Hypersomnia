import {
  findFirstRequestNode,
  findSystemNodeByPath,
  updateRequestInFileSystem,
} from '@/lib/utils'
import { Project } from '@/types/project'
import { createContext, useContext, useRef } from 'react'
import { create, useStore } from 'zustand'
import { Collection, QueryParameters, Request } from '../types/collection'

interface CollectionStoreProps {
  project: Project | null
  collection: Collection | null
}

interface CollectionState extends CollectionStoreProps {
  project: Project | null
  collection: Collection | null
  selectedRequestPath: string[] | null
  selectedRequest: Request | null
  sendTrigger: boolean
  setResponse: (response: Response | null) => void
  response: Response | null
  selectRequest: (path: string[]) => void
  sendRequest: () => void
  updateCollection: (collection: Collection) => void
  updateSelectedRequest: (request: Request) => void
  deleteCollection: () => void
  addQueryParam: () => void
  updateQueryParamField: (
    index: number,
    field: keyof QueryParameters,
    value: unknown,
  ) => void
  deleteQueryParam: (index: number) => void
  deleteAllParams: () => void
  updateRequestField: (field: keyof Request, value: unknown) => void
  updateRequestOptionField: (
    field: keyof Request['options'],
    value: unknown,
  ) => void
}

const createCollectionStore = (initProps: CollectionStoreProps) => {
  const DEFAULT_PROPS: CollectionStoreProps = {
    project: null,
    collection: null,
  }

  const { collection } = initProps

  const initialRequest = collection
    ? (findFirstRequestNode(collection?.fileSystem) ?? null)
    : null

  return create<CollectionState>((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    updateCollection: (collection) => set({ collection }),
    deleteCollection: () => set({ collection: null }),
    selectRequest: (path) => {
      set((state) => {
        if (!state.collection) return state
        const selectedRequest =
          findSystemNodeByPath(state.collection?.fileSystem, path)?.request ??
          null

        return { selectedRequest, selectedRequestPath: path }
      })
    },
    selectedRequest: initialRequest?.node?.request ?? null,
    selectedRequestPath: initialRequest?.path ?? null,
    response: null,
    sendTrigger: false,
    sendRequest: () =>
      set((state) => ({
        sendTrigger: !state.sendTrigger,
      })),
    setResponse: (response) => set({ response }),
    updateSelectedRequest: (updatedRequest) =>
      set((state) => {
        const { selectedRequestPath, collection } = state
        if (!selectedRequestPath || !collection) return state

        const updatedFileSystem = updateRequestInFileSystem(
          collection.fileSystem,
          selectedRequestPath,
          updatedRequest,
        )

        const updatedCollection = {
          ...collection,
          fileSystem: updatedFileSystem,
        }

        return {
          collection: updatedCollection,
          selectedRequest: updatedRequest,
        }
      }),
    addQueryParam: () =>
      set((state) => {
        if (!state.selectedRequest) return state
        const params = [...state.selectedRequest.queryParameters]
        params.push({ key: '', value: '', enabled: true })
        state.updateRequestField('queryParameters', params)
        return {}
      }),
    updateQueryParamField: (index, field, value) =>
      set((state) => {
        if (!state.selectedRequest) return state
        const params = [...state.selectedRequest.queryParameters]
        params[index] = { ...params[index], [field]: value }
        state.updateRequestField('queryParameters', params)
        return {}
      }),
    deleteQueryParam: (index) =>
      set((state) => {
        if (!state.selectedRequest) return state
        const params = [...state.selectedRequest.queryParameters]
        params.splice(index, 1)
        state.updateRequestField('queryParameters', params)
        return {}
      }),
    deleteAllParams: () =>
      set((state) => {
        if (!state.selectedRequest) return state
        state.updateRequestField('queryParameters', [])
        return {}
      }),
    updateRequestField: (field, value) =>
      set((state) => {
        const { selectedRequest } = state
        if (!selectedRequest) return state

        const updatedRequest = {
          ...selectedRequest,
          [field]: value,
        }

        state.updateSelectedRequest(updatedRequest)
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
  }))
}

type CollectionStore = ReturnType<typeof createCollectionStore>

export const CollectionContext = createContext<CollectionStore | null>(null)

type CollectionProviderProps = React.PropsWithChildren<CollectionStoreProps>

export function CollectionProvider({
  children,
  ...props
}: CollectionProviderProps) {
  const storeRef = useRef<CollectionStore>()
  const hasBeenCreatedWithPropsRef = useRef(false)

  const { project, collection } = props

  if (
    !storeRef.current ||
    (project && collection && !hasBeenCreatedWithPropsRef.current)
  ) {
    storeRef.current = createCollectionStore(props)
  }

  if (project && collection && !hasBeenCreatedWithPropsRef.current) {
    storeRef.current = createCollectionStore(props)
    hasBeenCreatedWithPropsRef.current = true
  }

  return (
    <CollectionContext.Provider value={storeRef.current}>
      {children}
    </CollectionContext.Provider>
  )
}

export default function useCollectionContext<T>(
  selector: (state: CollectionState) => T,
): T {
  const store = useContext(CollectionContext)
  if (!store) throw new Error('Missing CollectionContext.Provider in the tree')
  return useStore(store, selector)
}
