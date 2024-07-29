import { Input } from '@/components/ui/input'
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
import useCollectionContext from '@/zustand/collection-store'
import { Boxes, Code2, MoreHorizontal } from 'lucide-react'
import Editor, { EditorProps } from '@monaco-editor/react'
import { useTheme } from 'next-themes'
import { useCallback, useMemo } from 'react'
import { Label } from '@/components/ui/label'

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

const BodyTab = () => {
  const request = useCollectionContext((state) => state.selectedRequest)
  const updateRequestField = useCollectionContext(
    (state) => state.updateRequestField,
  )

  const theme = useTheme()

  const editorDefaultProps: EditorProps = useMemo(
    () => ({
      theme: theme.theme === 'dark' ? 'vs-dark' : 'light',
      height: '80vh',
      options: {
        minimap: { enabled: false },
      },
      onChange: (value) => updateRequestField('bodyContent', value),
    }),
    [theme.theme, updateRequestField],
  )

  const bodyType = request?.bodyType ?? 'none'
  const bodyContent = request?.bodyContent ?? ''

  const renderBodyInput = () => {
    switch (bodyType) {
      case 'json':
        return (
          <Editor {...editorDefaultProps} language="json" value={bodyContent} />
        )
      case 'xml':
        return (
          <Editor {...editorDefaultProps} language="xml" value={bodyContent} />
        )
      case 'yaml':
        return (
          <Editor {...editorDefaultProps} language="yaml" value={bodyContent} />
        )
      case 'plain-text':
        return (
          <Editor
            {...editorDefaultProps}
            language="plaintext"
            value={bodyContent}
          />
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

export default BodyTab
