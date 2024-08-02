import { cn } from '@/lib/utils'
import React from 'react'

const Loading = ({ className, ...props }: React.HTMLProps<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn('flex items-center justify-center', className)}
    >
      Loading...
    </span>
  )
}

export default Loading
