import { cn } from '@/lib/utils'

export function TypographyH2({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      {...props}
      className={cn(
        'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight',
        className,
      )}
    />
  )
}

export default TypographyH2
