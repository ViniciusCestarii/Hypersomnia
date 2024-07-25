import { Button } from '@/components/ui/button'
import { PanelHeaderContainer } from '@/components/ui/panel/panel-header-container'
import RequestBadge from '@/components/ui/panel/request-badge'
import useCollectionContext from '@/zustand/collection-store'

const RequestOptionPanel = () => {
  const request = useCollectionContext((state) => state.selectedRequest)
  const sendRequest = useCollectionContext((state) => state.sendRequest)

  return (
    <div className="flex flex-col">
      <PanelHeaderContainer>
        {request && (
          <div className="flex relative max-w-full w-full">
            <RequestBadge method={request.options.method} />{' '}
            <span className="font-semibold ml-2 shrink">{request.url}</span>
            <div className="px-2 bg-background absolute -right-2 -translate-y-1/2 top-1/2">
              <Button
                onClick={sendRequest}
                aria-label="send"
                title="send"
                variant="default"
                className="h-6"
              >
                Send
              </Button>
            </div>
          </div>
        )}
      </PanelHeaderContainer>
    </div>
  )
}

export default RequestOptionPanel
