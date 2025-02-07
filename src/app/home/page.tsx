import TypographyH2 from '@/components/ui/typography-h2'
import CollectionSection from '../collection-section'
import { Sun } from 'lucide-react'

export default function Home() {
  return (
    <div>
      <section className="flex  flex-col py-10 px-4 text-3xl sm:text-5xl max-w-screen-md w-full mx-auto">
        <Sun className="mx-auto -mb-5 size-10 -z-10 relative" />
        <TypographyH2 className="relative text-center text-pretty bg-background before:content-[''] before:absolute before:-top-[2px] before:left-1/2 before:-translate-x-1/2 before:w-12 before:h-[2px] before:bg-foreground before:mask-triangle">
          Design, Debug, and Test APIs with Complete Data Privacy
        </TypographyH2>
        <span className="text-lg text-center">
          No Servers, No Tracking, 100% Local Storage
        </span>
      </section>

      <CollectionSection />
    </div>
  )
}
