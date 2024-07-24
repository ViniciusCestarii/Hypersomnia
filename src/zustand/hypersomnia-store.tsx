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
    id: '71366efe-2b3b-4087-ab1b-e00ea1ea805b',
    title: 'Project 1',
    description: 'Description 1',
    collections: [
      {
        id: '7a73781d-5904-4aac-9c5a-c030f111885a',
        title: 'Collection 1',
        description: 'Description 1',
      },
      {
        id: '393c157c-7f3d-47f3-9a28-bd10f1ec563a',
        title: 'Collection 2',
        description: 'Description 2',
      },
      {
        id: '5156631e-0697-408a-ac80-654b990026f2',
        title: 'Collection 3',
        description: 'Description 3',
      },
      {
        id: '8299fb46-68c8-4c99-8cd5-936b5158de68',
        title: 'Collection 4',
        description: 'Description 4',
      },
      {
        id: '50a98039-b705-4879-8c44-e0ebcbb063ab',
        title: 'Collection 5',
        description: 'Description 5',
      },
    ],
  },
  {
    id: 'af7e7ef8-bf5e-4ba0-977d-36df84ba35c1',
    title: 'Project 2',
    description: 'Description 2',
    collections: [
      {
        id: '74148c7b-2cbc-4593-aa2e-0d821b8aa1fb',
        title: 'Collection 2',
        description: 'Description 2',
      },
    ],
  },
  {
    id: '31b94a56-00a4-4a8d-8a1e-471a6a1cd6e4',
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
