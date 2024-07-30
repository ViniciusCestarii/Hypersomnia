import { findSystemNodeByPath, updateRequestInFileSystem } from '@/lib/utils'
import {
  Collection,
  QueryParameters,
  Request,
  RequestFetchResult,
} from '@/types/collection'
import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { CreateProject, Project } from '../types/project'
import useCollectionsStore from './collections-store'

type HypersomniaStore = {
  projects: Project[]
  selectedProject: Project | null
  deleteProject: (id: string) => void
  createProject: (newProject: CreateProject) => void
  updateProjects: (projects: Project[]) => void
  selectProject: (id: string) => void
  selectedCollection: Collection | null
  updateCollection: (collection: Collection) => void
  selectedRequestPath: string[] | null
  selectedRequest: Request | null
  sendTrigger: boolean | undefined
  requestFetchResult: RequestFetchResult | null
  setRequestFetchResult: (requestFetchResult: RequestFetchResult | null) => void
  selectRequest: (path: string[]) => void
  sendRequest: () => void
  updateSelectedRequest: (request: Request) => void
  addQueryParam: () => void
  updateQueryParamField: (
    index: number,
    field: keyof QueryParameters,
    value: unknown,
  ) => void
  deleteQueryParam: (index: number) => void
  deleteAllParams: () => void
  updateRequestField: (field: keyof Request, value: unknown) => void
  updateRequestOptionField: (
    field: keyof Request['options'],
    value: unknown,
  ) => void
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
                    request: {
                      url: 'https://jsonplaceholder.typicode.com/posts',
                      queryParameters: [
                        {
                          key: 'userId',
                          value: '1',
                          enabled: true,
                        },
                        {
                          key: 'today',
                          enabled: false,
                        },
                      ],
                      options: {
                        method: 'get',
                      },
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
                    request: {
                      url: 'https://jsonplaceholder.typicode.com/users',
                      queryParameters: [],
                      options: {
                        method: 'get',
                      },
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
                    request: {
                      url: 'https://jsonplaceholder.typicode.com/posts',
                      queryParameters: [],
                      options: {
                        method: 'post',
                        data: {
                          title: 'foo',
                          body: 'bar',
                          userId: 1,
                        },
                      },
                    },
                  },
                ],
              },
              {
                name: 'request 4',
                request: {
                  url: 'https://jsonplaceholder.typicode.com/posts',
                  bodyType: 'json',
                  bodyContent: '{"title": "foo", "body": "bar", "userId": 1}',
                  queryParameters: [],
                  options: {
                    method: 'post',
                  },
                },
              },
              {
                name: 'folder 4',
                isFolder: true,
                children: [
                  {
                    name: 'request 4',
                    request: {
                      url: 'https://jsonplaceholder.typicode.com/users',
                      queryParameters: [],
                      options: {
                        method: 'post',
                        data: {
                          name: 'foo',
                          email: 'bar',
                        },
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            name: 'put',
            request: {
              url: 'https://jsonplaceholder.typicode.com/posts/1',
              queryParameters: [],
              options: {
                method: 'put',
                data: {
                  id: 1,
                  title: 'foo',
                  body: 'bar',
                  userId: 1,
                },
              },
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

const hpersomniaStateCreator: StateCreator<
  HypersomniaStore,
  [['zustand/persist', unknown]]
> = (set) => ({
  projects: initialProjects,
  selectedProject: null,
  selectedCollection: null,
  selectedRequest: null,
  selectedRequestPath: null,
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
  updateCollection: (collection) => set({ selectedCollection: collection }),
  selectRequest: (path) => {
    set((state) => {
      if (!state.selectedCollection) return state
      const selectedRequest =
        findSystemNodeByPath(state.selectedCollection?.fileSystem, path)
          ?.request ?? null

      return { selectedRequest, selectedRequestPath: path }
    })
  },
  requestFetchResult: null,
  sendTrigger: undefined,
  sendRequest: () =>
    set((state) => ({
      sendTrigger: !state.sendTrigger,
    })),
  setRequestFetchResult: (requestFetchResult) => set({ requestFetchResult }),
  updateSelectedRequest: (updatedRequest) =>
    set((state) => {
      const { selectedRequestPath, selectedCollection } = state
      if (!selectedRequestPath || !selectedCollection) return state

      const updatedFileSystem = updateRequestInFileSystem(
        selectedCollection.fileSystem,
        selectedRequestPath,
        updatedRequest,
      )

      const updatedCollection = {
        ...selectedCollection,
        fileSystem: updatedFileSystem,
      }

      return {
        selectedCollection: updatedCollection,
        selectedRequest: updatedRequest,
      }
    }),
  addQueryParam: () =>
    set((state) => {
      if (!state.selectedRequest) return state
      const params = [...state.selectedRequest.queryParameters]
      params.push({ key: '', value: '', enabled: true })
      state.updateRequestField('queryParameters', params)
      return {}
    }),
  updateQueryParamField: (index, field, value) =>
    set((state) => {
      if (!state.selectedRequest) return state
      const params = [...state.selectedRequest.queryParameters]
      params[index] = { ...params[index], [field]: value }
      state.updateRequestField('queryParameters', params)
      return {}
    }),
  deleteQueryParam: (index) =>
    set((state) => {
      if (!state.selectedRequest) return state
      const params = [...state.selectedRequest.queryParameters]
      params.splice(index, 1)
      state.updateRequestField('queryParameters', params)
      return {}
    }),
  deleteAllParams: () =>
    set((state) => {
      if (!state.selectedRequest) return state
      state.updateRequestField('queryParameters', [])
      return {}
    }),
  updateRequestField: (field, value) =>
    set((state) => {
      const { selectedRequest } = state
      if (!selectedRequest) return state

      const updatedRequest = {
        ...selectedRequest,
        [field]: value,
      }

      state.updateSelectedRequest(updatedRequest)
      return {}
    }),
  updateRequestOptionField: (field, value) =>
    set((state) => {
      const { selectedRequest } = state
      if (!selectedRequest) return state

      const updatedRequest = {
        ...selectedRequest,
        options: {
          ...selectedRequest.options,
          [field]: value,
        },
      }

      state.updateSelectedRequest(updatedRequest)
      return {}
    }),
})

export const useHypersomniaStore = create<HypersomniaStore>()(
  persist(hpersomniaStateCreator, {
    name: 'hypersomnia-store',
    storage: createJSONStorage(() => sessionStorage),
    partialize: (state) =>
      Object.fromEntries(
        Object.entries(state).filter(([key]) => key !== 'sendTrigger'),
      ),
  }),
)

export default useHypersomniaStore
