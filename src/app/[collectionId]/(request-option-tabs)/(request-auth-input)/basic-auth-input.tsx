import { Input, PasswordInput } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthBasic } from '@/types'
import useHypersomniaStore from '@/zustand/hypersomnia-store'
import debounce from 'lodash.debounce'

const BasicAuthInput = () => {
  const request = useHypersomniaStore((state) => state.selectedRequest!)
  const updateRequestField = useHypersomniaStore(
    (state) => state.updateRequestField,
  )

  const debouncedUpdateRequestField = debounce(
    (field: string, value: unknown) => {
      updateRequestField(field, value)
    },
    80,
  )

  const authData = request.auth?.data as AuthBasic | undefined

  return (
    <>
      <Label htmlFor="request-basic-auth-username">Username</Label>
      <Input
        id="request-basic-auth-username"
        autoComplete="off"
        defaultValue={authData?.username ?? ''}
        onChange={(e) =>
          debouncedUpdateRequestField('auth.data.username', e.target.value)
        }
      />
      <Label htmlFor="request-basic-auth-password">Password</Label>
      <PasswordInput
        autoComplete="new-password"
        id="request-basic-auth-password"
        defaultValue={authData?.password ?? ''}
        onChange={(e) =>
          debouncedUpdateRequestField('auth.data.password', e.target.value)
        }
      />
    </>
  )
}

export default BasicAuthInput
