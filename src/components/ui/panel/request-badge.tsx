import { getMethodColor } from '@/lib/utils'
import { MethodType } from '@/types/collection'

interface RequestBadgeProps {
  method: MethodType
}

const RequestBadge = ({ method }: RequestBadgeProps) => {
  return <span className={getMethodColor(method)}>{method}</span>
}

export default RequestBadge
