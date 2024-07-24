import { cn } from '@/lib/utils'

export function TypographyP({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <p {...props} className={cn('leading-7', className)} />
}

export default TypographyP
