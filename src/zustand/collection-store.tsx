import { create, useStore } from 'zustand'
import { Collection, Request } from '../types/collection'
import { Project } from '@/types/project'
import { createContext, useRef, useContext } from 'react'
import { findFirstRequestNode, updateRequestInFileSystem } from '@/lib/utils'

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
  selectRequest: (request: Request | null) => void
  sendRequest: () => void
  updateCollection: (collection: Collection) => void
  updateSelectedRequest: (request: Request) => void
  deleteCollection: () => void
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

  return create<CollectionState>((set, get) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    updateCollection: (collection) => set({ collection }),
    deleteCollection: () => set({ collection: null }),
    selectRequest: (selectedRequest) => set({ selectedRequest }),
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
