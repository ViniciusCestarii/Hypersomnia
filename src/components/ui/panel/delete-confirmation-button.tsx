import { AlertTriangle, Trash } from 'lucide-react'
import { Button, ButtonProps } from '../button'
import { cn } from '@/lib/utils'
import React from 'react'

const DeleteConfirmationButton = ({
  onConfirm,
  title,
  'aria-label': ariaLabel,
  iconSize = 12,
  className,
  text,
  ...props
}: ButtonProps & {
  onConfirm: () => void
  text?: string
  iconSize?: number
  className?: string
}) => {
  const [isConfirming, setIsConfirming] = React.useState(false)

  const handleClick = () => {
    if (isConfirming) {
      onConfirm()
      setIsConfirming(false)
    } else {
      setIsConfirming(true)
      setTimeout(() => setIsConfirming(false), 2000)
    }
  }

  return (
    <Button
      {...props}
      size="sm"
      variant="ghost"
      aria-label={isConfirming ? 'confirm delete' : ariaLabel}
      title={isConfirming ? 'confirm delete' : title}
      className={cn(
        className,
        isConfirming && 'text-warning hover:text-warning',
      )}
      onClick={handleClick}
    >
      {isConfirming ? (
        <AlertTriangle size={iconSize} className={text ? 'mr-1' : undefined} />
      ) : (
        <Trash size={iconSize} className={text ? 'mr-1' : undefined} />
      )}
      {isConfirming && text ? 'Confirm delete' : (text ?? '')}
    </Button>
  )
}

export default DeleteConfirmationButton
