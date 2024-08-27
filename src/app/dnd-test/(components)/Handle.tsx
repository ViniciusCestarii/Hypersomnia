import React from 'react'
import { Action, ActionProps } from './Action'
import { GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Handle({ className, ...props }: ActionProps) {
  return (
    <Action
      data-cypress="draggable-handle"
      {...props}
      className={cn(className, 'px-1')}
    >
      <GripVertical size={14} />
    </Action>
  )
}
