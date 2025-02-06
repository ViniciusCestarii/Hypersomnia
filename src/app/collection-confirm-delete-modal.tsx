import ConfirmModal from '@/components/ui/confirm-modal'
import { ResponsiveModal } from '@/components/ui/responsive-dialog'
import useHypersomniaStore from '@/zustand/hypersomnia-store'

interface CollectionConfirmDeleteModalProps
  extends Pick<
    React.ComponentProps<typeof ResponsiveModal>,
    'trigger' | 'open' | 'onOpenChange'
  > {
  collectionId: string
}

const CollectionConfirmDeleteModal = ({
  collectionId,
  ...props
}: CollectionConfirmDeleteModalProps) => {
  const deleteCollection = useHypersomniaStore(
    (state) => state.deleteCollection,
  )
  return (
    <ConfirmModal
      {...props}
      onConfirm={() => deleteCollection(collectionId)}
      title="Delete Collection"
      description={`Are you sure that you want to delete collection ${collectionId}`}
    />
  )
}

export default CollectionConfirmDeleteModal
