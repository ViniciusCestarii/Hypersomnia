import {
  findSystemNodeByPath,
  insertFile,
  insertFileNextToPath,
  removeFileInFileSystem,
  updateFileInFileSystem,
  updateRequestInFileSystem,
} from '@/lib/utils'
import {
  Collection,
  Cookie,
  CreateProject,
  FileSystemNode,
  HypersomniaRequest,
  Project,
  RequestFetchResult,
} from '@/types'
import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'

type HypersomniaStore = {
  projects: Project[]
  isReady: boolean
  setIsReady: (isReady: boolean) => void
  selectedProject: Project | null
  deleteProject: (id: string) => void
  createProject: (newProject: CreateProject) => void
  updateProjects: (projects: Project[]) => void
  selectProject: (id: string) => void
  selectedCollection: Collection | null
  updateCollection: (collection: Collection) => void
  selectCollection: (id: string) => void
  selectedRequestPath: string[] | null
  selectedRequest: HypersomniaRequest | null
  sendTrigger: boolean | undefined
  requestFetchResult: RequestFetchResult | null
  createFileSystemNode: (file: FileSystemNode, path?: string[]) => void
  duplicateFileSystemNode: (file: FileSystemNode, path: string[]) => void
  setRequestFetchResult: (requestFetchResult: RequestFetchResult | null) => void
  selectRequest: (path: string[]) => void
  sendRequest: () => void
  updateSelectedRequest: (request: HypersomniaRequest) => void
  updateRequestField: (field: string, value: unknown) => void
  updateRequestOptionField: (
    field: keyof HypersomniaRequest['options'],
    value: unknown,
  ) => void
  updateFile: (path: string[], updatedNode: FileSystemNode) => void
  deleteFile: (path: string[]) => void
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

export const initialProjects: Project[] = [
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
            id: '6ab86341-b932-4e63-b8f8-3c7fa72d537d',
            name: 'get',
            isFolder: true,
            children: [
              {
                id: '5bf24c9d-56b5-4c19-9b7a-9ea103c47b22',
                name: 'folder 1',
                isFolder: true,
                children: [
                  {
                    id: 'b17cd125-a12a-49e3-b974-ee7bb70ba5ff',
                    name: 'request 1',
                    request: {
                      url: 'https://jsonplaceholder.typicode.com/posts',
                      doc: testMd,
                      headers: [
                        {
                          id: 'f4b3a0d1-6c1c-4d2c-9f3f-1b0b1d5c3c9e',
                          key: 'Content-Type',
                          value: 'application/json',
                          enabled: true,
                        },
                      ],
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
                id: 'f0d65ebe-948e-4def-9074-2cde3a02d089',
                name: 'folder 2',
                isFolder: true,
                children: [
                  {
                    id: 'a08729b1-f892-4ebe-b093-94ec7a9942d8',
                    name: 'request 2',
                    request: {
                      url: 'https://jsonplaceholder.typicode.com/users',
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
            id: '77bba476-a16e-4512-8b90-81674b97ae69',
            name: 'post',
            isFolder: true,
            children: [
              {
                id: 'c949aabc-2664-448b-b068-7fb7b69421fe',
                name: 'folder 3',
                isFolder: true,
                children: [
                  {
                    id: '1d6f4cc2-ef00-499d-8167-bb501c9ba6ce',
                    name: 'request 3',
                    request: {
                      url: 'https://jsonplaceholder.typicode.com/posts',
                      body: {
                        type: 'json',
                        content:
                          '{\n    "title": "foo",\n    "body": "bar",\n    "userId": 1\n}',
                      },
                      options: {
                        method: 'post',
                      },
                    },
                  },
                ],
              },
              {
                id: '07dab6d4-14ce-4207-86da-f4c68ccc3107',
                name: 'request 4',
                request: {
                  url: 'https://jsonplaceholder.typicode.com/posts',
                  body: {
                    type: 'json',
                    content:
                      '{\n    "title": "foo",\n    "body": "bar",\n    "userId": 1\n}',
                  },
                  options: {
                    method: 'post',
                  },
                },
              },
              {
                id: '3f828e21-ff3b-4b5e-a67b-b68e896e51a0',
                name: 'folder 4',
                isFolder: true,
                children: [
                  {
                    id: '11bba476-a16e-4328-821a-81674b97ae69',
                    name: 'request 4',
                    request: {
                      url: 'https://jsonplaceholder.typicode.com/users',
                      body: {
                        type: 'json',
                        content: '{\n    "name": "foo",\n    "email": "bar"\n}',
                      },
                      options: {
                        method: 'post',
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            id: '77bba476-a16e-4328-8b90-81674b97ae69',
            name: 'put',
            request: {
              url: 'https://jsonplaceholder.typicode.com/posts/1',
              body: {
                type: 'json',
                content:
                  '{\n    "title": "foo",\n    "body": "bar",\n    "id": 1\n}',
              },
              options: {
                method: 'put',
              },
            },
          },
          {
            id: '77bba476-a14e-4328-8b90-12674b97ae69',
            name: 'Test Basic Auth',
            request: {
              url: 'https://httpbin.org/basic-auth/user/pass',
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
            id: '742aa476-a16e-4328-8b90-81674b97ae69',
            name: 'Get Cookie',
            request: {
              url: 'https://yummy-cookies.vercel.app',
              options: {
                method: 'get',
              },
            },
          },
          {
            id: '742aa476-a16e-4328-8b90-81674b97a232',
            name: 'Get Brazil PIB',
            request: {
              url: 'https://servicodados.ibge.gov.br/api/v3/agregados/6784/periodos/-6/variaveis/9808',
              options: {
                method: 'get',
              },
              queryParameters: [
                {
                  id: '2692d070-64ae-4189-8637-25850b849c73',
                  key: 'localidades',
                  value: 'N1[all]',
                  enabled: true,
                },
              ],
              doc: `# Brazil PIB
          
Get Brazil PIB data from IBGE API.

\`\`\`json
[
  {
    "id": "9808",
    "variavel": "PIB - valores correntes",
    "unidade": "Milhões de Reais",
    "resultados": [
      {
        "classificacoes": [],
        "series": [
          {
            "localidade": {
              "id": "1",
              "nivel": {
                "id": "N1",
                "nome": "Brasil"
              },
              "nome": "Brasil"
            },
            "serie": {
              "2016": "6269328",
              "2017": "6585479",
              "2018": "7004141",
              "2019": "7389131",
              "2020": "7609597",
              "2021": "9012142"
            }
          }
        ]
      }
    ]
  }
]
\`\`\`
              `,
            },
          },
          {
            id: '742aa476-a16e-4328-8b90-81674237a232',
            name: 'Get Brazil IBGE "Agregados"',
            request: {
              url: 'https://servicodados.ibge.gov.br/api/v3/agregados',
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
  isReady: false,
  projects: initialProjects,
  selectedProject: null,
  selectedCollection: null,
  selectedRequest: null,
  selectedRequestPath: null,
  setIsReady: (isReady) => set({ isReady }),
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
  updateCollection: (collection) =>
    set((state) => {
      const { selectedProject } = state
      if (!selectedProject) return state

      const updatedCollections = selectedProject.collections.map((coll) =>
        coll.id === collection.id ? collection : coll,
      )

      const updatedProject = {
        ...selectedProject,
        collections: updatedCollections,
      }

      return {
        projects: state.projects.map((project) =>
          project.id === selectedProject.id ? updatedProject : project,
        ),
        selectedCollection: collection,
      }
    }),
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
  createFileSystemNode: (file, path) =>
    set((state) => {
      const { selectedCollection, selectedProject } = state
      if (!selectedCollection || !selectedProject) return state

      const updatedFileSystem = insertFile(
        selectedCollection.fileSystem,
        path ?? [],
        file,
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
        projects: state.projects.map((project) =>
          project.id === selectedProject.id ? updatedProject : project,
        ),
        selectedCollection: updatedCollection,
      }
    }),
  duplicateFileSystemNode: (duplicatedFile, originalPath) =>
    set((state) => {
      const { selectedCollection, projects, selectedProject } = state
      if (!selectedCollection || !selectedProject) return state

      const updatedFileSystem = insertFileNextToPath(
        selectedCollection.fileSystem,
        originalPath,
        duplicatedFile,
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
      }
    }),
  updateFile: (path, updatedNode) =>
    set((state) => {
      const { selectedCollection, projects, selectedProject } = state
      if (!selectedCollection || !selectedProject) return state

      const updatedFileSystem = updateFileInFileSystem(
        selectedCollection.fileSystem,
        path,
        updatedNode,
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
      }
    }),
  deleteFile: (path) =>
    set((state) => {
      const { selectedCollection, projects, selectedProject } = state
      if (!selectedCollection || !selectedProject) return state

      const updatedFileSystem = removeFileInFileSystem(
        selectedCollection.fileSystem,
        path,
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

      const isDeletingSelectedRequest = state.selectedRequestPath?.some(
        (selectedRequestSegment) => {
          const fileIdToBeDeleted = path[path.length - 1]
          return selectedRequestSegment === fileIdToBeDeleted
        },
      )

      return {
        projects: projects.map((project) =>
          project.id === selectedProject.id ? updatedProject : project,
        ),
        selectedCollection: updatedCollection,
        selectedRequest: isDeletingSelectedRequest
          ? null
          : state.selectedRequest,
        selectedRequestPath: isDeletingSelectedRequest
          ? null
          : state.selectedRequestPath,
      }
    }),
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
