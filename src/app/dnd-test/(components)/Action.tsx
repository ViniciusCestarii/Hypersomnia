import React, { CSSProperties } from 'react'
export interface ActionProps extends React.HTMLAttributes<HTMLButtonElement> {
  active?: {
    fill: string
    background: string
  }
  cursor?: CSSProperties['cursor']
}

export function Action({ active, cursor, style, ...props }: ActionProps) {
  return (
    <button
      {...props}
      tabIndex={0}
      style={
        {
          ...style,
          cursor,
          '--fill': active?.fill,
          '--background': active?.background,
        } as CSSProperties
      }
    />
  )
}
