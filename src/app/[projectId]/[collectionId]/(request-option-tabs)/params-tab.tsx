import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import ClipboardButton from '@/components/ui/panel/clipboard-button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import TypographyH3 from '@/components/ui/Typography-h3'
import { cn, getRequestWithQueryParams } from '@/lib/utils'
import { QueryParameters } from '@/types/collection'
import useCollectionContext from '@/zustand/collection-store'
import { Plus, Trash, Trash2 } from 'lucide-react'
import React from 'react'

const ParamsTab = () => {
  const request = useCollectionContext((state) => state.selectedRequest)

  const requestUrlWithQuery = request ? getRequestWithQueryParams(request) : ''

  return (
    <>
      <Alert className="bg-foreground/5 overflow-auto w-[calc(100%_-_1rem)] mx-2">
        <AlertTitle className="uppercase text-xs text-foreground/75 ">
          URL preview
        </AlertTitle>
        <AlertDescription className="text-extra-xs break-words max-h-28 relative">
          {request ? (
            <>
              {requestUrlWithQuery}
              <ClipboardButton
                label="Copy URL"
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
  const updateSelectedRequest = useCollectionContext(
    (state) => state.updateSelectedRequest,
  )

  const handleAddParam = () => {
    if (!request) return
    const requestCopy = { ...request }
    requestCopy.queryParameters = requestCopy.queryParameters || []
    requestCopy.queryParameters.push({ key: '', value: '', enabled: true })
    updateSelectedRequest(requestCopy)
  }

  const handleParamChange = (
    index: number,
    field: keyof QueryParameters,
    value: unknown,
  ) => {
    if (!request) return
    const requestCopy = { ...request }
    const params = [...requestCopy.queryParameters]
    params[index] = { ...params[index], [field]: value }
    requestCopy.queryParameters = params
    updateSelectedRequest(requestCopy)
  }

  const handleDeleteParam = (index: number) => {
    if (!request) return
    const requestCopy = { ...request }
    const params = requestCopy.queryParameters.filter((_, i) => i !== index)
    requestCopy.queryParameters = params
    updateSelectedRequest(requestCopy)
  }

  const handleDeleteAllParams = () => {
    if (!request) return
    const requestCopy = { ...request }
    requestCopy.queryParameters = []
    updateSelectedRequest(requestCopy)
  }

  return (
    <>
      <TypographyH3 className="pt-4 px-2">Query Parameters</TypographyH3>
      <div className="flex">
        <Button
          onClick={handleAddParam}
          size="sm"
          variant="ghost"
          className="rounded-none h-9 flex items-center"
        >
          <Plus size={12} className="mr-1" />
          Add
        </Button>
        <Button
          onClick={handleDeleteAllParams}
          size="sm"
          variant="ghost"
          className="rounded-none h-9 flex items-center"
        >
          <Trash2 size={12} className="mr-1" />
          Delete All
        </Button>
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
              className="h-9 rounded-none border-none"
              onChange={(e) => handleParamChange(index, 'key', e.target.value)}
            />
            <Label className="sr-only" htmlFor={valueInputId}>
              Value
            </Label>
            <Input
              id={valueInputId}
              type="text"
              value={param.value ?? ''}
              className="h-9 rounded-none border-none"
              onChange={(e) =>
                handleParamChange(index, 'value', e.target.value)
              }
            />
            <Button
              size="sm"
              variant="ghost"
              className="rounded-none h-9 flex items-center"
              onClick={() => handleDeleteParam(index)}
            >
              <Trash size={12} />
            </Button>
            <div className="rounded-none h-9 flex items-center hover:bg-accent px-3">
              <Label className="sr-only" htmlFor={checkboxId}>
                Enabled
              </Label>
              <Checkbox
                id={checkboxId}
                checked={param.enabled}
                onCheckedChange={(checked) =>
                  handleParamChange(index, 'enabled', checked)
                }
              />
            </div>
          </div>
        )
      })}
    </>
  )
}

export default ParamsTab
