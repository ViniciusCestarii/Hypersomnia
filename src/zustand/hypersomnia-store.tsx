import { create } from 'zustand'
import { CreateProject, Project } from '../types/project'
import useCollectionsStore from './collections-store'
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
    id: 'project-1',
    title: 'Project 1',
    description: 'Description 1',
    collections: [
      {
        id: '7a73781d-5904-4aac-9c5a-c030f111885a',
        title: 'Collection 1',
        description: 'Description 1',
        fileSystem: [
          {
            name: 'get',
            isFolder: true,
            children: [
              {
                name: 'folder 1',
                isFolder: true,
                children: [
                  {
                    name: 'request 1',
                    isFolder: false,
                    request: {
                      id: '1',
                      method: 'GET',
                      url: 'https://jsonplaceholder.typicode.com/posts',
                    },
                  },
                ],
              },
              {
                name: 'folder 2',
                isFolder: true,
                children: [
                  {
                    name: 'request 2',
                    isFolder: false,
                    request: {
                      id: '2',
                      method: 'GET',
                      url: 'https://jsonplaceholder.typicode.com/users',
                    },
                  },
                ],
              },
            ],
          },
          {
            name: 'post',
            isFolder: true,
            children: [
              {
                name: 'folder 3',
                isFolder: true,
                children: [
                  {
                    name: 'request 3',
                    isFolder: false,
                    request: {
                      id: '3',
                      method: 'POST',
                      url: 'https://jsonplaceholder.typicode.com/posts',
                      body: JSON.stringify({
                        title: 'foo',
                        body: 'bar',
                        userId: 1,
                      }),
                    },
                  },
                ],
              },
              {
                name: 'request 4',
                isFolder: false,
                request: {
                  id: '3',
                  method: 'POST',
                  url: 'https://jsonplaceholder.typicode.com/posts',
                  body: JSON.stringify({
                    title: 'foo',
                    body: 'bar',
                    userId: 1,
                  }),
                },
              },
              {
                name: 'folder 4',
                isFolder: true,
                children: [
                  {
                    name: 'request 4',
                    isFolder: false,
                    request: {
                      id: '4',
                      method: 'POST',
                      url: 'https://jsonplaceholder.typicode.com/users',
                      body: JSON.stringify({
                        name: 'foo',
                        email: 'bar',
                      }),
                    },
                  },
                ],
              },
            ],
          },
          {
            isFolder: false,
            name: 'put',
            request: {
              id: '5',
              method: 'PUT',
              url: 'https://jsonplaceholder.typicode.com/posts/1',
              body: JSON.stringify({
                id: 1,
                title: 'foo',
                body: 'bar',
                userId: 1,
              }),
            },
          },
        ],
      },
      {
        id: '393c157c-7f3d-47f3-9a28-bd10f1ec563a',
        title: 'Collection 2',
        description: 'Description 2',
        fileSystem: [],
      },
      {
        id: '5156631e-0697-408a-ac80-654b990026f2',
        title: 'Collection 3',
        description: 'Description 3',
        fileSystem: [],
      },
      {
        id: '8299fb46-68c8-4c99-8cd5-936b5158de68',
        title: 'Collection 4',
        description: 'Description 4',
        fileSystem: [],
      },
      {
        id: '50a98039-b705-4879-8c44-e0ebcbb063ab',
        title: 'Collection 5',
        description: 'Description 5',
        fileSystem: [],
      },
    ],
  },
  {
    id: 'project-2',
    title: 'Project 2',
    description: 'Description 2',
    collections: [
      {
        id: '74148c7b-2cbc-4593-aa2e-0d821b8aa1fb',
        title: 'Collection 2',
        description: 'Description 2',
        fileSystem: [],
      },
    ],
  },
  {
    id: 'project-3',
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
      const id = newProject.title.toLowerCase().replace(' ', '-')

      if (state.projects.some((project) => project.id === id)) {
        return { projects: state.projects }
      }

      const newProjectWithId = {
        ...newProject,
        id,
      }

      return {
        projects: [...state.projects, newProjectWithId],
      }
    }),
  updateProjects: (projects: Project[]) => set({ projects }),
  selectProject: (id: string) =>
    set((state) => {
      const { updateCollections, selectCollection } =
        useCollectionsStore.getState()

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
