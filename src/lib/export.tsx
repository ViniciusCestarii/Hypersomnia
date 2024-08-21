import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { copyToClipboard, hypersomniaRequestToCurl } from './utils'
import { toast } from 'sonner'
import { HypersomniaRequest } from '@/types'

export const copyRequestAsCurl = (request: HypersomniaRequest) => {
  if (!request) return
  const textToCopy = hypersomniaRequestToCurl(request)
  copyToClipboard(textToCopy)

  toast.success('Copied to clipboard', {
    description: (
      <ScrollArea type="hover">
        <pre className="max-w-64 max-h-24">
          <code className="break-all pb-2 pr-2">{textToCopy}</code>
        </pre>
        <ScrollBar orientation="vertical" />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    ),
    action: {
      label: 'Close',
      onClick: () => null,
    },
  })
}
