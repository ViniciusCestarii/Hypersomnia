import { cn, getMethodColor } from '@/lib/utils'
import { MethodType } from '@/types/collection'

interface RequestMethodBadgeProps {
  method: MethodType
}

const RequestMethodBadge = ({ method }: RequestMethodBadgeProps) => {
  return (
    <span className={cn(getMethodColor(method), 'uppercase')}>{method}</span>
  )
}

export default RequestMethodBadge
