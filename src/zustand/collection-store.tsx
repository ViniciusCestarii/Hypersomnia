import { create, useStore } from 'zustand'
import { Collection } from '../types/collection'
import { Project } from '@/types/project'
import { createContext, useRef, useContext } from 'react'

interface CollectionStoreProps {
  project: Project | null
  collection: Collection | null
}

interface CollectionState extends CollectionStoreProps {
  project: Project | null
  collection: Collection | null
  updateCollection: (collection: Collection) => void
  deleteCollection: () => void
}

const createCollectionStore = (initProps: CollectionStoreProps) => {
  const DEFAULT_PROPS: CollectionStoreProps = {
    project: null,
    collection: null,
  }

  return create<CollectionState>((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    updateCollection: (collection) => set({ collection }),
    deleteCollection: () => set({ collection: null }),
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

  const { project, collection } = props

  if (!storeRef.current || (project && collection)) {
    storeRef.current = createCollectionStore(props)
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
