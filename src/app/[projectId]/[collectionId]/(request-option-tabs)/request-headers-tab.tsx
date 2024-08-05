import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Terminal } from 'lucide-react'

const RequestHeadersTab = () => {
  return (
    <div>
      <Alert>
        <Terminal className="size-4" />
        <AlertTitle>Some headers may be overriden by browser</AlertTitle>
        <AlertDescription className="text-xs">
          When making requests from the browser, certain headers like{' '}
          <code>User-Agent</code> and <code>Referer</code> may be overridden for
          security reasons. Please check the Network tab in your browser&apos;s
          developer tools.{' '}
          <a
            href="https://developer.mozilla.org/docs/Glossary/Forbidden_header_name"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            Know more
          </a>
        </AlertDescription>
      </Alert>
    </div>
  )
}

export default RequestHeadersTab
