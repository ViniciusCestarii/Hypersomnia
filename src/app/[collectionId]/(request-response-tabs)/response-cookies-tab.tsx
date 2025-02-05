import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import useHypersomniaStore from '@/zustand/hypersomnia-store'
import { Cookie } from 'lucide-react'

const ResponseCookiesTab = () => {
  const cookies = useHypersomniaStore((state) => state.cookies)

  return (
    <>
      {cookies.length > 0 && (
        <Table className="w-full">
          <TableHeader>
            <TableRow className="uppercase text-sm">
              <TableHead className="text-xs h-9">Name</TableHead>
              <TableHead className="text-xs  h-9">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cookies.map(({ name, value }) => (
              <TableRow key={name}>
                <TableCell className="break-all">{name}</TableCell>
                <TableCell className="break-all align-top">
                  {String(value)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <div className={cn('space-y-4', cookies.length > 0 ? 'pt-8' : 'pt-2')}>
        <Alert>
          <Cookie className="size-4" />
          <AlertTitle>Third-party cookies are not displayed</AlertTitle>
          <AlertDescription className="text-xs">
            Please check the Application tab in your browser&apos;s developer
            tools.{' '}
            <a
              href="https://developer.mozilla.org/docs/Web/API/Document/cookie#read_all_cookies_accessible_from_this_location"
              className="underline"
              target="_blank"
              rel="noreferrer"
            >
              Know more
            </a>
          </AlertDescription>
        </Alert>
      </div>
    </>
  )
}

export default ResponseCookiesTab
