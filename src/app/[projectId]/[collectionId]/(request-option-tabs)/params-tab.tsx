import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button, ButtonProps } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import ClipboardButton from '@/components/ui/panel/clipboard-button'
import { Skeleton } from '@/components/ui/skeleton'
import TypographyH3 from '@/components/ui/Typography-h3'
import { cn, getRequestWithQueryParams } from '@/lib/utils'
import useCollectionContext from '@/zustand/collection-store'
import { AlertTriangle, Plus, Trash } from 'lucide-react'
import { useState } from 'react'

const ParamsTab = () => {
  const request = useCollectionContext((state) => state.selectedRequest)

  const requestUrlWithQuery = request ? getRequestWithQueryParams(request) : ''
  const isRequestUrlWithQueryEmpty = requestUrlWithQuery === ''

  return (
    <>
      <Alert className="bg-foreground/5 overflow-auto w-[calc(100%_-_1rem)] mx-2">
        <AlertTitle className="uppercase text-xs text-foreground/75 ">
          URL preview
        </AlertTitle>
        <AlertDescription className="text-extra-xs break-words pr-8 max-h-28 min-w-24 relative">
          {request ? (
            <>
              {isRequestUrlWithQueryEmpty ? '...' : requestUrlWithQuery}
              <ClipboardButton
                label="copy URL"
                disabled={isRequestUrlWithQueryEmpty}
                text={requestUrlWithQuery}
                variant={'ghost'}
                className="absolute right-0 bottom-0"
              />
            </>
          ) : (
            <Skeleton className="h-[0.6rem] mt-3 mb-[0.15rem] w-[60%]" />
          )}
        </AlertDescription>
      </Alert>
      <QueryParametersSection />
    </>
  )
}

const QueryParametersSection = () => {
  const request = useCollectionContext((state) => state.selectedRequest)
  const addQueryParam = useCollectionContext((state) => state.addQueryParam)
  const updateQueryParamField = useCollectionContext(
    (state) => state.updateQueryParamField,
  )
  const deleteQueryParam = useCollectionContext(
    (state) => state.deleteQueryParam,
  )
  const deleteAllParams = useCollectionContext((state) => state.deleteAllParams)

  return (
    <>
      <TypographyH3 className="pt-4 px-2">Query Parameters</TypographyH3>
      <div className="flex">
        <Button
          onClick={addQueryParam}
          size="sm"
          variant="ghost"
          aria-label="add query parameter"
          title="add query parameter"
          className="rounded-none h-9 flex items-center"
        >
          <Plus size={12} className="mr-1" />
          Add
        </Button>
        <DeleteConfirmationButton
          disabled={
            !request?.queryParameters || request.queryParameters.length === 0
          }
          onConfirm={deleteAllParams}
          text="Delete all"
          aria-label="delete all query parameters"
          title="delete all query parameters"
          className="rounded-none h-9 flex items-center"
          iconSize={12}
        />
      </div>
      {request?.queryParameters?.map((param, index) => {
        const keyInputId = `param-key-${index}`
        const valueInputId = `param-value-${index}`
        const checkboxId = `param-enabled-${index}`
        return (
          <div
            key={index}
            className={cn('flex items-center', !param.enabled && 'opacity-50')}
          >
            <Label className="sr-only" htmlFor={keyInputId}>
              Key
            </Label>
            <Input
              id={keyInputId}
              type="text"
              value={param.key ?? ''}
              className="h-9 rounded-none border-none placeholder:text-muted-foreground/50 placeholder:text-xs placeholder:uppercase"
              placeholder="key"
              onChange={(e) =>
                updateQueryParamField(index, 'key', e.target.value)
              }
            />
            <Label className="sr-only" htmlFor={valueInputId}>
              Value
            </Label>
            <Input
              id={valueInputId}
              type="text"
              value={param.value ?? ''}
              className="h-9 rounded-none border-none placeholder:text-muted-foreground/50 placeholder:text-xs placeholder:uppercase"
              placeholder="value"
              onChange={(e) =>
                updateQueryParamField(index, 'value', e.target.value)
              }
            />
            <DeleteConfirmationButton
              onConfirm={() => deleteQueryParam(index)}
              aria-label="delete query parameter"
              title="delete query parameter"
              className="rounded-none h-9 flex items-center"
              iconSize={12}
            />
            <div className="rounded-none h-9 flex items-center hover:bg-accent px-3">
              <Label className="sr-only" htmlFor={checkboxId}>
                Enabled
              </Label>
              <Checkbox
                id={checkboxId}
                aria-label={
                  param.enabled ? 'disable query param' : 'enable query param'
                }
                title={
                  param.enabled ? 'disable query param' : 'enable query param'
                }
                checked={param.enabled}
                onCheckedChange={(checked) =>
                  updateQueryParamField(index, 'enabled', checked)
                }
              />
            </div>
          </div>
        )
      })}
    </>
  )
}

const DeleteConfirmationButton = ({
  onConfirm,
  title,
  'aria-label': ariaLabel,
  iconSize = 12,
  className,
  text,
  ...props
}: ButtonProps & {
  onConfirm: () => void
  text?: string
  iconSize?: number
  className?: string
}) => {
  const [isConfirming, setIsConfirming] = useState(false)

  const handleClick = () => {
    if (isConfirming) {
      onConfirm()
      setIsConfirming(false)
    } else {
      setIsConfirming(true)
      setTimeout(() => setIsConfirming(false), 2000)
    }
  }

  return (
    <Button
      {...props}
      size="sm"
      variant="ghost"
      aria-label={isConfirming ? 'confirm delete' : ariaLabel}
      title={isConfirming ? 'confirm delete' : title}
      className={cn(
        className,
        isConfirming && 'text-warning hover:text-warning',
      )}
      onClick={handleClick}
    >
      {isConfirming ? (
        <AlertTriangle size={iconSize} className={text ? 'mr-1' : undefined} />
      ) : (
        <Trash size={iconSize} className={text ? 'mr-1' : undefined} />
      )}
      {isConfirming && text ? 'Confirm delete' : (text ?? '')}
    </Button>
  )
}

export default ParamsTab
