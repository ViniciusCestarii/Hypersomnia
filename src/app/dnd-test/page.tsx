'use client'

import { initialProjects } from '@/zustand/initial-data'
import { SortableTree } from './SortableTree'
import { useState } from 'react'

export default function App() {
  const [items, setItems] = useState(
    initialProjects[0].collections[0].fileSystem,
  )
  return (
    <SortableTree items={items} filteredItems={items} setItems={setItems} />
  )
}
