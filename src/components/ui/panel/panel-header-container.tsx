import React from 'react'
import { Separator } from '../separator'
import { cn } from '@/lib/utils'

export const PanelHeaderContainer = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <>
    <div {...props} className={cn('flex items-center h-8 px-2', className)}>
      {children}
    </div>
    <Separator />
  </>
)
