import { create } from 'zustand'
import { Collection, CreateCollection } from '../types/collection'

type CollectionsStore = {
  collections: Collection[]
  selectedCollection: Collection | null
  createCollection: (newCollection: CreateCollection) => void
  selectCollection: (collectionId: string | null) => void
  deleteCollection: (collectionId: string) => void
  updateCollections: (collections: Collection[]) => void
}

const testCollection: Collection[] = [
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
                    method: 'GET',
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
                isFolder: false,
                request: {
                  id: '2',
                  url: 'https://jsonplaceholder.typicode.com/users',
                  queryParameters: [],
                  options: {
                    method: 'GET',
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
                isFolder: false,
                request: {
                  id: '3',
                  url: 'https://jsonplaceholder.typicode.com/posts',
                  queryParameters: [],
                  options: {
                    method: 'POST',
                    body: JSON.stringify({
                      title: 'foo',
                      body: 'bar',
                      userId: 1,
                    }),
                  },
                },
              },
            ],
          },
          {
            name: 'request 4',
            isFolder: false,
            request: {
              id: '3',
              url: 'https://jsonplaceholder.typicode.com/posts',
              queryParameters: [],
              options: {
                method: 'POST',
                body: JSON.stringify({
                  title: 'foo',
                  body: 'bar',
                  userId: 1,
                }),
              },
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
                  url: 'https://jsonplaceholder.typicode.com/users',
                  queryParameters: [],
                  options: {
                    method: 'POST',
                    body: JSON.stringify({
                      name: 'foo',
                      email: 'bar',
                    }),
                  },
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
          url: 'https://jsonplaceholder.typicode.com/posts/1',
          queryParameters: [],
          options: {
            method: 'PUT',
            body: JSON.stringify({
              id: 1,
              title: 'foo',
              body: 'bar',
              userId: 1,
            }),
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
]

const useCollectionsStore = create<CollectionsStore>((set) => ({
  selectedProject: null,
  collections: testCollection,
  selectedCollection: null,
  createCollection: (newCollection) =>
    set((state) => {
      const newCollectionWithId = {
        ...newCollection,
        id: state.collections.length.toString(),
      }

      return {
        collections: [...state.collections, newCollectionWithId],
      }
    }),
  selectCollection: (collectionId) => {
    set((state) => ({
      selectedCollection: state.collections.find(
        (collection) => collection.id === collectionId,
      ),
    }))
  },
  updateCollections: (collections) => set({ collections }),
  deleteCollection: (collectionId) =>
    set((state) => ({
      collections: state.collections.filter(
        (collection) => collection.id !== collectionId,
      ),
    })),
}))

export default useCollectionsStore
