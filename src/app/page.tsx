import CollectionSection from './collection-section'
import ProjectSidenav from './projects-sidenav'

export default function Home() {
  return (
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
  )
}
