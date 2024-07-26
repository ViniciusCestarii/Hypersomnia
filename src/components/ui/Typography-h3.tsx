import { cn } from '@/lib/utils'

export function TypographyH3({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      {...props}
      className={cn(' uppercase text-xs text-foreground/75 mb-1', className)}
    />
  )
}

export default TypographyH3
