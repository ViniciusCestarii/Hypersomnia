import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthBearerToken } from '@/types'
import useHypersomniaStore from '@/zustand/hypersomnia-store'
import debounce from 'lodash.debounce'

const BearerTokenAuthInput = () => {
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

  const authData = request.auth?.data as AuthBearerToken | undefined

  return (
    <>
      <Label htmlFor="request-bearer-token-auth-token">Token</Label>
      <Input
        id="request-bearer-token-auth-token"
        autoComplete="off"
        defaultValue={authData?.token ?? ''}
        onChange={(e) =>
          debouncedUpdateRequestField('auth.data.token', e.target.value)
        }
      />
      <Label htmlFor="request-bearer-token-auth-prefix">Prefix</Label>
      <Input
        id="request-bearer-token-auth-prefix"
        autoComplete="off"
        defaultValue={authData?.prefix ?? ''}
        onChange={(e) =>
          debouncedUpdateRequestField('auth.data.prefix', e.target.value)
        }
      />
    </>
  )
}

export default BearerTokenAuthInput
