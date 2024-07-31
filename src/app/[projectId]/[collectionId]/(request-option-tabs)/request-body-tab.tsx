import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Editor from '@/components/ui/panel/editor'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { BodyType } from '@/types/collection'
import useHypersomniaStore from '@/zustand/hypersomnia-store'
import { EditorProps } from '@monaco-editor/react'
import { Boxes, Code2, MoreHorizontal } from 'lucide-react'
import { useMemo } from 'react'

interface BodyTypeOption {
  value: BodyType
  label: string
}

const bodyTypes: Record<string, BodyTypeOption[]> = {
  Structured: [
    { value: 'form-data', label: 'Form Data' },
    { value: 'x-www-form-urlencoded', label: 'Form URL Encoded' },
  ],
  Text: [
    { value: 'json', label: 'JSON' },
    { value: 'xml', label: 'XML' },
    { value: 'yaml', label: 'YAML' },
    { value: 'plain-text', label: 'Plain Text' },
  ],
  Other: [
    { value: 'file', label: 'File' },
    { value: 'none', label: 'No Body' },
  ],
}

const groupIcons: Record<string, React.ElementType> = {
  Structured: Boxes,
  Text: Code2,
  Other: MoreHorizontal,
}

const RequestBodyTab = () => {
  const request = useHypersomniaStore((state) => state.selectedRequest!)
  const updateRequestField = useHypersomniaStore(
    (state) => state.updateRequestField,
  )

  const editorProps: EditorProps = useMemo(
    () => ({
      onChange: (value) => updateRequestField('bodyContent', value),
    }),
    [updateRequestField],
  )

  const bodyType = request.bodyType ?? 'none'
  const bodyContent = request.bodyContent ?? ''

  const renderBodyInput = () => {
    switch (bodyType) {
      case 'json':
        return <Editor {...editorProps} language="json" value={bodyContent} />
      case 'xml':
        return <Editor {...editorProps} language="xml" value={bodyContent} />
      case 'yaml':
        return <Editor {...editorProps} language="yaml" value={bodyContent} />
      case 'plain-text':
        return (
          <Editor {...editorProps} language="plaintext" value={bodyContent} />
        )
      case 'file':
        return (
          <Input
            type="file"
            className="border-none"
            placeholder="Select file"
          />
        )
      default:
        return null
    }
  }

  return (
    <>
      <Label className="sr-only" htmlFor="request-body-type">
        Body type
      </Label>
      <Select
        value={bodyType}
        onValueChange={(value) => {
          if (value === 'none') {
            updateRequestField('bodyContent', undefined)
          }
          updateRequestField('bodyType', value)
        }}
      >
        <SelectTrigger
          aria-label="request body type"
          id="request-body-type"
          className="border-0 w-fit"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(bodyTypes).map(([group, options]) => {
            const Icon = groupIcons[group] ?? null
            return (
              <SelectGroup key={group}>
                <SelectLabel className="flex items-center text-muted-foreground text-xs">
                  {Icon && <Icon className="mr-2 size-4" />}
                  {group}
                </SelectLabel>
                {options.map(({ value, label }) => (
                  <SelectItem
                    key={value}
                    value={value}
                    className="ml-2 text-xs"
                  >
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            )
          })}
        </SelectContent>
      </Select>
      <Separator />
      {renderBodyInput()}
    </>
  )
}

export default RequestBodyTab
