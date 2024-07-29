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
import { Boxes, Code2, MoreHorizontal } from 'lucide-react' // Import relevant icons

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

const renderBodyInput = (bodyType: BodyType) => {
  switch (bodyType) {
    case 'json':
      return <Input placeholder="Enter JSON body" />
    case 'xml':
      return <Input placeholder="Enter XML body" />
    case 'yaml':
      return <Input placeholder="Enter YAML body" />
    case 'plain-text':
      return <Input placeholder="Enter plain text body" />
    case 'file':
      return <Input placeholder="Select file" />
    default:
      return null
  }
}

const BodyTab = () => {
  const request = useCollectionContext((state) => state.selectedRequest)
  const updateRequestField = useCollectionContext(
    (state) => state.updateRequestField,
  )
  return (
    <>
      <Select
        value={request?.bodyType ?? 'none'}
        onValueChange={(value) => updateRequestField('bodyType', value)}
      >
        <SelectTrigger className="border-0 w-fit">
          <SelectValue placeholder="No Body" />
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
      {renderBodyInput(request?.bodyType ?? 'none')}
    </>
  )
}

export default BodyTab
