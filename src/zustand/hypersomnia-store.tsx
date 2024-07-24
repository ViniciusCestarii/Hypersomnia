import { create } from 'zustand'
import { CreateProject, Project } from '../types/project'
import useCollectionStore from './collection-store'
type HypersomniaStore = {
  projects: Project[]
  selectedProject: Project | null
  deleteProject: (id: string) => void
  createProject: (newProject: CreateProject) => void
  updateProjects: (projects: Project[]) => void
  selectProject: (id: string) => void
}

const initialProjects: Project[] = [
  {
    id: '0',
    title: 'Project 1',
    description: 'Description 1',
    collections: [
      {
        id: '0',
        title: 'Collection 1',
        description: 'Description 1',
      },
      {
        id: '1',
        title: 'Collection 2',
        description: 'Description 2',
      },
      {
        id: '2',
        title: 'Collection 3',
        description: 'Description 3',
      },
      {
        id: '3',
        title: 'Collection 4',
        description: 'Description 4',
      },
      {
        id: '4',
        title: 'Collection 5',
        description: 'Description 5',
      },
    ],
  },
  {
    id: '1',
    title: 'Project 2',
    description: 'Description 2',
    collections: [
      {
        id: '1',
        title: 'Collection 2',
        description: 'Description 2',
      },
    ],
  },
  {
    id: '2',
    title: 'Project 3',
    description: 'Description 3',
    collections: [],
  },
]

const useHypersomniaStore = create<HypersomniaStore>((set) => ({
  projects: initialProjects,
  selectedProject: null,
  deleteProject: (id: string) =>
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
    })),
  createProject: (newProject: CreateProject) =>
    set((state) => {
      const newProjectWithId = {
        ...newProject,
        id: state.projects.length.toString(),
      }

      return {
        projects: [...state.projects, newProjectWithId],
      }
    }),
  updateProjects: (projects: Project[]) => set({ projects }),
  selectProject: (id: string) =>
    set((state) => {
      const { updateCollections, selectCollection } =
        useCollectionStore.getState()

      const project = state.projects.find((project) => project.id === id)

      if (project) {
        updateCollections(project.collections)
        const hasCollections = project.collections.length > 0
        selectCollection(hasCollections ? project.collections[0].id : null)
      }

      return {
        selectedProject: project ?? null,
      }
    }),
}))

export default useHypersomniaStore
