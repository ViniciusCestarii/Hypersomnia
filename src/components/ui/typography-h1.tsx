import { cn } from '@/lib/utils'

export function TypographyH1({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      {...props}
      className={cn(
        'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl lg:leading-normal',
        className,
      )}
    />
  )
}

export default TypographyH1
