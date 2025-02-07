'use client'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { CircleX } from 'lucide-react'
import { useRef } from 'react'

interface ClearableInputProps extends React.HTMLProps<HTMLInputElement> {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function ClearableInput({
  className,
  ...props
}: ClearableInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClearInput = () => {
    if (props.onChange) {
      props.onChange({
        target: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>)
    }
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        placeholder="Type something..."
        type="text"
        {...props}
        className={cn(className, 'pe-9')}
      />
      {props.value && (
        <button
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Clear input"
          title="Clear input"
          onClick={handleClearInput}
        >
          <CircleX size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
