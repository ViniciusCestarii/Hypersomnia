import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthBearerToken } from '@/types/collection'
import useHypersomniaStore from '@/zustand/hypersomnia-store'

const BearerTokenAuthInput = () => {
  const request = useHypersomniaStore((state) => state.selectedRequest!)
  const updateRequestField = useHypersomniaStore(
    (state) => state.updateRequestField,
  )

  const authData = request.auth?.data as AuthBearerToken | undefined

  return (
    <>
      <Label htmlFor="request-bearer-token-auth-token">Token</Label>
      <Input
        id="request-bearer-token-auth-token"
        autoComplete="off"
        value={authData?.token ?? ''}
        onChange={(e) => updateRequestField('auth.data.token', e.target.value)}
      />
      <Label htmlFor="request-bearer-token-auth-prefix">Prefix</Label>
      <Input
        id="request-bearer-token-auth-prefix"
        autoComplete="off"
        value={authData?.prefix ?? ''}
        onChange={(e) => updateRequestField('auth.data.prefix', e.target.value)}
      />
    </>
  )
}

export default BearerTokenAuthInput
