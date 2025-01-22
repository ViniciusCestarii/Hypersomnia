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
import { initialProjects } from './initial-data'

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
