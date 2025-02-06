import ConfirmModal from '@/components/ui/confirm-modal'
import { ResponsiveModal } from '@/components/ui/responsive-dialog'
import { Collection } from '@/types'
import useHypersomniaStore from '@/zustand/hypersomnia-store'

interface CollectionConfirmDeleteModalProps
  extends Pick<
    React.ComponentProps<typeof ResponsiveModal>,
    'trigger' | 'open' | 'onOpenChange'
  > {
  collection: Collection
}

const CollectionConfirmDeleteModal = ({
  collection,
  ...props
}: CollectionConfirmDeleteModalProps) => {
  const deleteCollection = useHypersomniaStore(
    (state) => state.deleteCollection,
  )
  return (
    <ConfirmModal
      {...props}
      onConfirm={() => deleteCollection(collection.id)}
      title="Delete Collection"
      description={`Are you sure that you want to delete collection ${collection.title}?`}
    />
  )
}

export default CollectionConfirmDeleteModal
