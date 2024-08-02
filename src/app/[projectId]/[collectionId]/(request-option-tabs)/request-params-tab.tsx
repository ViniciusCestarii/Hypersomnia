import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button, ButtonProps } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import ClipboardButton from '@/components/ui/panel/clipboard-button'
import TypographyH3 from '@/components/ui/Typography-h3'
import { cn, getRequestWithQueryParams } from '@/lib/utils'
import { QueryParameters } from '@/types/collection'
import useHypersomniaStore from '@/zustand/hypersomnia-store'
import { AnimatePresence, Reorder } from 'framer-motion'
import { AlertTriangle, GripVertical, Plus, Trash } from 'lucide-react'
import { useState } from 'react'

const RequestParamsTab = () => {
  const request = useHypersomniaStore((state) => state.selectedRequest!)

  const requestUrlWithQuery = getRequestWithQueryParams(request)
  const isRequestUrlWithQueryEmpty = requestUrlWithQuery === ''

  return (
    <>
      <Alert className="bg-foreground/5">
        <AlertTitle className="uppercase text-xs text-foreground/75 ">
          URL preview
        </AlertTitle>
        <AlertDescription className="text-xss break-words pr-8 max-h-28 min-w-24 relative">
          {isRequestUrlWithQueryEmpty ? '...' : requestUrlWithQuery}
          <ClipboardButton
            label="copy URL"
            disabled={isRequestUrlWithQueryEmpty}
            text={requestUrlWithQuery}
            variant={'ghost'}
            className="absolute right-0 bottom-0"
          />
        </AlertDescription>
      </Alert>
      <QueryParametersSection />
    </>
  )
}

const QueryParametersSection = () => {
  const request = useHypersomniaStore((state) => state.selectedRequest!)
  const addQueryParam = useHypersomniaStore((state) => state.addQueryParam)
  const updateRequestField = useHypersomniaStore(
    (state) => state.updateRequestField,
  )
  const deleteAllParams = useHypersomniaStore((state) => state.deleteAllParams)
  const handleSaveReorder = (newOrder: string[]) => {
    const reorderedParams = newOrder
      .map((id) => request.queryParameters.find((param) => param.id === id))
      .filter((param) => param !== undefined)

    updateRequestField('queryParameters', reorderedParams)
  }

  const localQueryParamsId = request.queryParameters.map((p) => p.id)

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
          disabled={request.queryParameters.length === 0}
          onConfirm={deleteAllParams}
          text="Delete all"
          aria-label="delete all query parameters"
          title="delete all query parameters"
          className="rounded-none h-9 flex items-center"
          iconSize={12}
        />
      </div>
      <Reorder.Group
        axis="y"
        values={localQueryParamsId}
        onReorder={handleSaveReorder}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {localQueryParamsId.map((id, index) => {
            const param = request.queryParameters[index]
            if (!param) return null

            return (
              <Reorder.Item
                key={id}
                value={id}
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.15 },
                }}
                exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
                whileDrag={{ backgroundColor: '#FAFAFA0D' }}
                className={cn(
                  'flex items-center select-none',
                  !param.enabled && 'opacity-[0.5_!important]',
                )}
              >
                <GripVertical className="cursor-grab min-w-6 p-[6px] h-9" />
                <QueryParamInput key={id} index={index} param={param} />
              </Reorder.Item>
            )
          })}
        </AnimatePresence>
      </Reorder.Group>
    </>
  )
}

interface QueryParamInputProps {
  index: number
  param: QueryParameters
}

const QueryParamInput = ({ index, param }: QueryParamInputProps) => {
  const deleteQueryParam = useHypersomniaStore(
    (state) => state.deleteQueryParam,
  )
  const updateQueryParamField = useHypersomniaStore(
    (state) => state.updateQueryParamField,
  )

  const keyInputId = `param-key-${index}`
  const valueInputId = `param-value-${index}`
  const checkboxId = `param-enabled-${index}`
  if (!param) return null
  return (
    <>
      <Label className="sr-only" htmlFor={keyInputId}>
        Key
      </Label>
      <Input
        id={keyInputId}
        type="text"
        value={param.key ?? ''}
        className="h-9 rounded-none border-none placeholder:text-muted-foreground/50 placeholder:text-xs placeholder:uppercase"
        placeholder="key"
        onChange={(e) => updateQueryParamField(index, 'key', e.target.value)}
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
        onChange={(e) => updateQueryParamField(index, 'value', e.target.value)}
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
          title={param.enabled ? 'disable query param' : 'enable query param'}
          checked={param.enabled}
          onCheckedChange={(checked) =>
            updateQueryParamField(index, 'enabled', checked)
          }
        />
      </div>
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

export default RequestParamsTab
