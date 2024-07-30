import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import useHypersomniaStore from '@/zustand/hypersomnia-store'
import { Terminal } from 'lucide-react'

const ResponseHeadersTab = () => {
  const { response } =
    useHypersomniaStore((state) => state.requestFetchResult) ?? {}

  return (
    <div
      style={{
        borderRadius: '0.5rem',
      }}
    >
      <Table className="w-full">
        <TableHeader>
          <TableRow className="uppercase text-sm">
            <TableHead className="text-xs h-9">Name</TableHead>
            <TableHead className="text-xs  h-9">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(response?.headers ?? {}).map(([key, value]) => (
            <TableRow key={key}>
              <TableCell className="break-all">{key}</TableCell>
              <TableCell className="break-all align-top">
                {String(value)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="px-2 pt-8">
        <Alert>
          <Terminal className="size-4" />
          <AlertTitle>Some headers may not be displayed</AlertTitle>
          <AlertDescription className="text-xs">
            please check the Network tab in your browser&apos;s developer tools.{' '}
            <a
              href="https://developer.mozilla.org/docs/Web/HTTP/Headers/Access-Control-Expose-Headers"
              className="underline"
              target="_blank"
              rel="noreferrer"
            >
              Know more
            </a>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}

export default ResponseHeadersTab
