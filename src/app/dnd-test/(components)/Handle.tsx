import React from 'react'
import { Action, ActionProps } from './Action'
import { GripVertical } from 'lucide-react'

export function Handle(props: ActionProps) {
  return (
    <Action data-cypress="draggable-handle" {...props}>
      <GripVertical size={14} />
    </Action>
  )
}
