'use client'

import TypographyH2 from '@/components/ui/typography-h2'
import useHypersomniaStore from './zustand/hypersomnia-store'
import { Button } from '@/components/ui/button'
import { useQueryState } from 'nuqs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect } from 'react'

const ProjectsList = () => {
  const { projects, selectProject, selectedProject } = useHypersomniaStore()

  const [filter, setFilter] = useQueryState('filter')
  const [projectId, setProjectId] = useQueryState('project')

  const handleSelectProject = (id: string) => {
    setProjectId(id)
    selectProject(id)
  }

  useEffect(() => {
    if (projectId) {
      selectProject(projectId)
    }
  }, [projectId, selectProject])

  const filteredProjects = filter
    ? projects.filter((project) =>
        project.title.toLowerCase().includes(filter.toLowerCase()),
      )
    : projects

  return (
    <div>
      <TypographyH2>Projects</TypographyH2>
      <Label className="sr-only" htmlFor="project-filter">
        Filter
      </Label>
      <Input
        id="project-filter"
        type="search"
        placeholder="Filter"
        value={filter ?? ''}
        onChange={({ target }) => setFilter(target.value)}
      />
      <ul className="space-y-2">
        {filteredProjects.map((project) => {
          const isSelected = project.id === selectedProject?.id
          return (
            <li key={project.id} className="flex">
              <span className="w-4 h-2 font-extrabold">
                {isSelected && '>'}
              </span>
              <Button onClick={() => handleSelectProject(project.id)}>
                {project.title}
              </Button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ProjectsList
