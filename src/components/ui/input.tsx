import * as React from 'react'

import { cn } from '@/lib/utils'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Button } from './button'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const handlePasswordVisibilityToggle = () => {
      setShowPassword((prev) => !prev)
    }

    return (
      <div className="relative">
        <Input
          type={showPassword ? type : 'password'}
          className={className}
          ref={ref}
          {...props}
        />
        <Button
          size="icon"
          aria-label={showPassword ? 'hide password' : 'show password'}
          title={showPassword ? 'hide password' : 'show password'}
          variant="ghost"
          className="absolute top-1/2 -translate-y-1/2 bg-background rounded-full right-1 flex items-center"
          onClick={handlePasswordVisibilityToggle}
        >
          {showPassword ? (
            <EyeOffIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </Button>
      </div>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'

export { Input, PasswordInput }
