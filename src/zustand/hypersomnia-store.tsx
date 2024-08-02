import { findSystemNodeByPath, updateRequestInFileSystem } from '@/lib/utils'
import {
  Collection,
  Cookie,
  QueryParameters,
  Request,
  RequestFetchResult,
} from '@/types/collection'
import { v4 as uuidv4 } from 'uuid'
import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { CreateProject, Project } from '../types/project'

type HypersomniaStore = {
  projects: Project[]
  selectedProject: Project | null
  deleteProject: (id: string) => void
  createProject: (newProject: CreateProject) => void
  updateProjects: (projects: Project[]) => void
  selectProject: (id: string) => void
  selectedCollection: Collection | null
  updateCollection: (collection: Collection) => void
  selectCollection: (id: string) => void
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
  updateRequestField: (field: string, value: unknown) => void
  updateRequestOptionField: (
    field: keyof Request['options'],
    value: unknown,
  ) => void
  cookies: Cookie[]
  setCookies: (cookies: Cookie[]) => void
}

const testMd = `# Hypersomnia ☀

## Test 

### markdown

A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

### Bulleted Lists

* [ ] todo
* [x] done

### Numbered List

1. one
2. two

A table:

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1, Column 1 | Row 1, Column 2 | Row 1, Column 3 |
| Row 2, Column 1 | Row 2, Column 2 | Row 2, Column 3 |
| Row 3, Column 1 | Row 3, Column 2 | Row 3, Column 3 |`

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
                      doc: testMd,
                      queryParameters: [
                        {
                          id: '22d4ae2e-d37b-4538-a37a-c8b009c8886f',
                          key: 'userId',
                          value: '1',
                          enabled: true,
                        },
                        {
                          id: '119556a5-411f-4956-8ed0-75e1f8660044',
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
          {
            name: 'Test Basic Auth',
            request: {
              url: 'https://httpbin.org/basic-auth/user/pass',
              queryParameters: [],
              auth: {
                type: 'basic',
                enabled: true,
                data: {
                  username: 'user',
                  password: 'pass',
                },
              },
              options: {
                method: 'get',
              },
            },
          },
          {
            name: 'Get Cookie',
            request: {
              url: 'https://yummy-cookies.vercel.app',
              queryParameters: [],
              options: {
                method: 'get',
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

const hypersomniaStateCreator: StateCreator<HypersomniaStore> = (set) => ({
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
      const selectedProject = state.projects.find(
        (project) => project.id === id,
      )
      return { selectedProject }
    }),
  selectCollection: (id) =>
    set((state) => {
      if (!state.selectedProject) return state
      const selectedCollection = state.selectedProject.collections.find(
        (collection) => collection.id === id,
      )
      return { selectedCollection }
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
  cookies: [],
  setCookies: (cookies) => set({ cookies }),
  requestFetchResult: null,
  sendTrigger: undefined,
  sendRequest: () =>
    set((state) => ({
      sendTrigger: !state.sendTrigger,
    })),
  setRequestFetchResult: (requestFetchResult) => set({ requestFetchResult }),
  updateSelectedRequest: (updatedRequest) =>
    set((state) => {
      const {
        selectedRequestPath,
        selectedCollection,
        projects,
        selectedProject,
      } = state
      if (!selectedRequestPath || !selectedCollection || !selectedProject)
        return state

      const updatedFileSystem = updateRequestInFileSystem(
        selectedCollection.fileSystem,
        selectedRequestPath,
        updatedRequest,
      )

      const updatedCollection = {
        ...selectedCollection,
        fileSystem: updatedFileSystem,
      }

      const updatedProject = {
        ...selectedProject,
        collections: selectedProject.collections.map((collection) =>
          collection.id === selectedCollection.id
            ? updatedCollection
            : collection,
        ),
      }

      return {
        projects: projects.map((project) =>
          project.id === selectedProject.id ? updatedProject : project,
        ),
        selectedCollection: updatedCollection,
        selectedRequest: updatedRequest,
      }
    }),
  addQueryParam: () =>
    set((state) => {
      if (!state.selectedRequest) return state
      const params = [...state.selectedRequest.queryParameters]
      params.push({ id: uuidv4(), key: '', value: '', enabled: true })
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

      const keys = field.split('.')
      const lastKey = keys.pop()
      if (!lastKey) {
        throw new Error('Invalid field')
      }
      const nestedObject = keys.reduce((obj: any, key) => {
        if (!obj[key]) obj[key] = {}
        return obj[key]
      }, selectedRequest)

      nestedObject[lastKey] = value

      state.updateSelectedRequest({ ...selectedRequest })
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

const keysToIgnore = ['sendTrigger', 'cookies']

export const useHypersomniaStore = create<HypersomniaStore>()(
  persist(hypersomniaStateCreator, {
    name: 'hypersomnia-store',
    partialize: (state) =>
      Object.fromEntries(
        Object.entries(state).filter(([key]) => !keysToIgnore.includes(key)),
      ),
  }),
)

export default useHypersomniaStore
