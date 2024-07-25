import { PanelHeaderContainer } from '@/components/ui/panel/panel-header-container'
import RequestBadge from '@/components/ui/panel/request-badge'
import useCollectionContext from '@/zustand/collection-store'

const RequestOptionPanel = () => {
  const request = useCollectionContext((state) => state.selectedRequest)

  return (
    <div className="flex flex-col">
      <PanelHeaderContainer>
        {request && (
          <>
            <RequestBadge method={request.method} />{' '}
            <span className="font-semibold ml-2">{request.url}</span>
          </>
        )}
      </PanelHeaderContainer>
    </div>
  )
}

export default RequestOptionPanel
