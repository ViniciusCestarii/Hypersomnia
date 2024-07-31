import { Checkbox } from '@/components/ui/checkbox'
import { Input, PasswordInput } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthBasic } from '@/types/collection'
import useHypersomniaStore from '@/zustand/hypersomnia-store'

const BasicAuthInput = () => {
  const request = useHypersomniaStore((state) => state.selectedRequest!)
  const updateRequestField = useHypersomniaStore(
    (state) => state.updateRequestField,
  )

  const authData = request.auth?.data as AuthBasic | undefined

  return (
    <div className="grid grid-cols-[100px_1fr] gap-x-2 gap-y-3 items-center px-3 py-2">
      <Label htmlFor="request-basic-auth-enabled">Enabled</Label>
      <Checkbox
        id="request-basic-auth-enabled"
        checked={request.auth?.enabled}
        onCheckedChange={(value) => updateRequestField('auth.enabled', value)}
      />
      <Label htmlFor="request-basic-auth-username">Username</Label>
      <Input
        id="request-basic-auth-username"
        autoComplete="off"
        value={authData?.username ?? ''}
        onChange={(e) =>
          updateRequestField('auth.data.username', e.target.value)
        }
      />
      <Label htmlFor="request-basic-auth-password">Password</Label>
      <PasswordInput
        autoComplete="new-password"
        id="request-basic-auth-password"
        value={authData?.password ?? ''}
        onChange={(e) =>
          updateRequestField('auth.data.password', e.target.value)
        }
      />
    </div>
  )
}

export default BasicAuthInput
