import React, { useState, useRef } from 'react'
import { Button, ButtonProps } from '../button'
import { copyToClipboard } from '@/lib/utils'
import { Check, Clipboard } from 'lucide-react'

interface ClipboardButtonProps
  extends Omit<ButtonProps, 'onClick' | 'aria-label' | 'title'> {
  text: string
  label: string
}

const ClipboardButton = ({ text, label, ...props }: ClipboardButtonProps) => {
  const [hasCopied, setHasCopied] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null) // Reference to hold timeout ID

  const handleClick = () => {
    copyToClipboard(text)
    setHasCopied(true)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setHasCopied(false)
    }, 1000)
  }

  return (
    <Button
      {...props}
      onClick={handleClick}
      aria-label={label}
      title={hasCopied ? 'copied' : label}
      variant="ghost"
      size="icon"
    >
      {hasCopied ? <Check size={16} /> : <Clipboard size={16} />}
    </Button>
  )
}

export default ClipboardButton
