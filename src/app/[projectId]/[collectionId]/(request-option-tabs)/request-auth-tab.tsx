import { Label } from '@/components/ui/label'
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
import { cn } from '@/lib/utils'
import { AuthType } from '@/types/collection'
import useHypersomniaStore from '@/zustand/hypersomnia-store'
import { Boxes, Code2, MoreHorizontal } from 'lucide-react'
import BasicAuthInput from './(request-auth-input)/basic-auth-input'

interface AuthTypeOption {
  value: AuthType
  label: string
}

const authTypes: Record<string, AuthTypeOption[]> = {
  'Auth Types': [
    { value: 'bearer token', label: 'Bearer Token' },
    { value: 'basic', label: 'Basic' },
  ],
  Other: [{ value: 'none', label: 'No Auth' }],
}

const groupIcons: Record<string, React.ElementType> = {
  Structured: Boxes,
  Text: Code2,
  Other: MoreHorizontal,
}

const RequestAuthTab = () => {
  const request = useHypersomniaStore((state) => state.selectedRequest!)
  const updateRequestField = useHypersomniaStore(
    (state) => state.updateRequestField,
  )

  const authType = request.auth?.type ?? 'none'

  const renderAuthInput = () => {
    switch (authType) {
      case 'basic':
        return <BasicAuthInput />
      default:
        return null
    }
  }

  return (
    <>
      <Label className="sr-only" htmlFor="request-auth-type">
        Auth type
      </Label>
      <Select
        value={authType}
        onValueChange={(value) => {
          if (value === 'none') {
            updateRequestField('auth', undefined)
          } else {
            updateRequestField('auth.type', value)
            updateRequestField('auth.enabled', true)
          }
        }}
      >
        <SelectTrigger
          aria-label="request auth type"
          id="request-auth-type"
          className="border-0 w-fit"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(authTypes).map(([group, options]) => {
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
      <div
        className={cn(
          'grid grid-cols-[100px_1fr] gap-x-2 gap-y-3 items-center px-3 py-2',
          !request.auth?.enabled && 'opacity-50',
        )}
      >
        {renderAuthInput()}
      </div>
    </>
  )
}

export default RequestAuthTab
