import TypographyH1 from '@/components/ui/typography-h1'
import CollectionSection from './collection-section'
import ProjectSidenav from './projects-sidenav'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <TypographyH1>Hypersomnia</TypographyH1>
      <div
        style={{
          display: 'grid',
          gridTemplateAreas: 'sidenav content',
          gridTemplateColumns: 'minmax(160px, 1fr) 3fr',
        }}
      >
        <ProjectSidenav />
        <CollectionSection />
      </div>
    </main>
  )
}
