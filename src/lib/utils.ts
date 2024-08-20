import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { html as beautifyHtml } from 'js-beautify'
import { EditorProps } from '@monaco-editor/react'
import { AxiosRequestConfig } from 'axios'
import {
  AuthBasic,
  AuthBearerToken,
  Cookie,
  FileSystemNode,
  HypersomniaRequest,
  MethodType,
  RequestBody,
} from '@/types'
import { v4 } from 'uuid'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMethodColor(method: MethodType): string {
  switch (method) {
    case 'get':
      return 'text-green-500'
    case 'post':
      return 'text-blue-500'
    case 'put':
      return 'text-yellow-500'
    case 'delete':
      return 'text-red-500'
    case 'patch':
      return 'text-purple-500'
    case 'options':
    case 'head':
      return 'text-gray-500'
    default:
      return ''
  }
}

export function getStatusColor(status: number): string {
  if (status < 200) return 'text-gray-500'
  if (status < 300) return 'text-green-500'
  if (status < 400) return 'text-blue-500'
  if (status < 500) return 'text-yellow-500'
  return 'text-red-500'
}

export const filterNodes = (
  nodes: FileSystemNode[],
  filter: string,
): FileSystemNode[] => {
  if (!filter) return nodes

  const lowercasedFilter = filter.toLowerCase()

  return nodes
    .filter((node) => {
      if (node.isFolder) {
        const filteredChildren = filterNodes(node.children ?? [], filter)
        return filteredChildren.length > 0
      }
      return node.name.toLowerCase().includes(lowercasedFilter)
    })
    .map((node) => ({
      ...node,
      children: node.isFolder
        ? filterNodes(node.children ?? [], filter)
        : node.children,
    }))
}

type FindResult = {
  node: FileSystemNode | null
  path: string[]
}

export const findFirstRequestNode = (
  nodes: FileSystemNode[],
  currentPath: string[] = [],
): FindResult => {
  for (const node of nodes) {
    if (node.isFolder) {
      const result = findFirstRequestNode(node.children ?? [], [
        ...currentPath,
        node.id,
      ])
      if (result.node) return result
    }
    if (node.request) return { node, path: [...currentPath, node.id] }
  }
  return { node: null, path: [] }
}

export const findFileByPath = (
  nodes: FileSystemNode[],
  path: string[],
): FileSystemNode | null => {
  let currentNodes = nodes

  for (const segment of path) {
    const foundNode = currentNodes.find((node) => node.id === segment)
    if (!foundNode) return null

    if (foundNode.isFolder) {
      currentNodes = foundNode.children ?? []
    } else if (segment === path[path.length - 1]) {
      return foundNode
    } else {
      return null
    }
  }

  return null
}

export const updateFileInFileSystem = (
  fileSystem: FileSystemNode[],
  path: string[],
  fileNode: FileSystemNode,
): FileSystemNode[] => {
  if (path.length === 0) return fileSystem

  const [head, ...tail] = path

  return fileSystem.map((node) => {
    if (node.id === head) {
      if (tail.length === 0) {
        return fileNode
      } else if (node.isFolder && node.children) {
        return {
          ...node,
          children: updateFileInFileSystem(node.children, tail, fileNode),
        }
      }
    }
    return node
  })
}

export const removeFileInFileSystem = (
  fileSystem: FileSystemNode[],
  path: string[],
): FileSystemNode[] => {
  if (path.length === 0) return fileSystem

  const [head, ...tail] = path

  return fileSystem.flatMap((node) => {
    if (node.id === head) {
      if (tail.length === 0) {
        return []
      } else if (node.isFolder && node.children) {
        return {
          ...node,
          children: removeFileInFileSystem(node.children, tail),
        }
      }
    }
    return node
  })
}

export const updateRequestInFileSystem = (
  fileSystem: FileSystemNode[],
  path: string[],
  updatedRequest: HypersomniaRequest,
): FileSystemNode[] => {
  if (path.length === 0) return fileSystem

  const [head, ...tail] = path

  return fileSystem.map((node) => {
    if (node.id === head) {
      if (tail.length === 0 && node.request) {
        return { ...node, request: updatedRequest }
      } else if (node.isFolder && node.children) {
        return {
          ...node,
          children: updateRequestInFileSystem(
            node.children,
            tail,
            updatedRequest,
          ),
        }
      }
    }
    return node
  })
}

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

export const findSystemNodeByPath = (
  fileSystem: FileSystemNode[],
  path: string[],
): FileSystemNode | undefined => {
  const findNode = (
    nodes: FileSystemNode[],
    path: string[],
  ): FileSystemNode | undefined => {
    if (path.length === 0) return undefined

    const [head, ...tail] = path

    for (const node of nodes) {
      if (node.id === head) {
        if (tail.length === 0) return node

        if (node.isFolder && node.children) {
          return findNode(node.children, tail)
        }
      }
    }

    return undefined
  }

  return findNode(fileSystem, path)
}

export const getRequestWithQueryParams = (
  request: HypersomniaRequest,
): string => {
  if (
    !request.url &&
    (request?.queryParameters ?? []).filter(
      (param) => param.key && param.enabled,
    ).length === 0
  )
    return ''
  const params = new URLSearchParams()

  request?.queryParameters?.forEach((param) => {
    if (param.key && param.enabled) {
      params.append(param.key, param.value ?? '')
    }
  })

  const hasProtocol =
    request.url.startsWith('http://') || request.url.startsWith('https://')

  const addInterrogation = request.url.includes('?') ? '&' : '?'

  return `${hasProtocol ? '' : 'http://'}${request.url}${params.size > 0 && request.url.length > 0 ? addInterrogation : ''}${params.toString()}`
}

export const requestMethods: MethodType[] = [
  'get',
  'post',
  'put',
  'delete',
  'patch',
  'options',
  'head',
]

export const httpStatusCodes: { [key: number]: string } = {
  100: 'Continue',
  101: 'Switching Protocols',
  102: 'Processing',
  103: 'Early Hints',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  207: 'Multi-Status',
  208: 'Already Reported',
  226: 'IM Used',
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  307: 'Temporary Redirect',
  308: 'Permanent Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Payload Too Large',
  414: 'URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Range Not Satisfiable',
  417: 'Expectation Failed',
  418: "I'm a teapot",
  421: 'Misdirected Request',
  422: 'Unprocessable Entity',
  423: 'Locked',
  424: 'Failed Dependency',
  425: 'Too Early',
  426: 'Upgrade Required',
  428: 'Precondition Required',
  429: 'Too Many Requests',
  431: 'Request Header Fields Too Large',
  451: 'Unavailable For Legal Reasons',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates',
  507: 'Insufficient Storage',
  508: 'Loop Detected',
  510: 'Not Extended',
  511: 'Network Authentication Required',
}

export const getBodyData = ({ type, content }: RequestBody) => {
  if (content === undefined) return undefined

  if (type === 'json') {
    try {
      return JSON.parse(content)
    } catch (e) {
      return content
    }
  }
  return content
}

interface GenerateEditorDefaultProps {
  theme?: string
}

export const generateEditorDefaultProps = ({
  theme,
}: GenerateEditorDefaultProps): EditorProps => ({
  theme: theme === 'dark' ? 'dark' : 'light',
  height: '100%',
  options: {
    minimap: { enabled: false },
    formatOnPaste: true,
    fontSize: 12,
    readOnlyMessage: {
      value: 'Editor is read-only 👀',
    },
  },
})

export const formatHtmlContent = (content: string, tabSize = 2): string =>
  beautifyHtml(content, { indent_size: tabSize })

export const timeAgo = (requestStartTime: number): string => {
  const now = new Date().getTime()
  const elapsed = now - requestStartTime

  const seconds = Math.floor(elapsed / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return days === 1 ? '1 day ago' : `${days} days ago`
  if (hours > 0) return hours === 1 ? '1 hour ago' : `${hours} hours ago`
  if (minutes > 0)
    return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`

  return 'Just now'
}

export const getAuthConfig = ({
  auth,
}: HypersomniaRequest): AxiosRequestConfig['headers'] => {
  if (!auth?.enabled) return {}

  switch (auth.type) {
    case 'basic': {
      const authData = auth.data as AuthBasic | undefined
      return {
        Authorization: `Basic ${btoa(
          `${authData?.username ?? ''}:${authData?.password ?? ''}`,
        )}`,
      }
    }
    case 'bearer token': {
      const authData = auth.data as AuthBearerToken | undefined
      return {
        Authorization: `${
          authData?.prefix ?? 'Bearer'
        } ${authData?.token ?? ''}`,
      }
    }
    default:
      return {}
  }
}

export const getCookies = (): Cookie[] => {
  const ignoreMyCookies = [
    'hypersomnia_left_panel_size',
    'hypersomnia_middle_panel_size',
    'hypersomnia_right_panel_size',
  ]

  const cookies = document.cookie.split(';')
  const result: Cookie[] = []

  cookies.forEach((cookie) => {
    const [name, value] = cookie.split('=').map((part) => part.trim())
    if (ignoreMyCookies.filter((ignore) => ignore === name).length === 0) {
      result.push({ name, value })
    }
  })

  return result
}

export const getDefinedHeaders = () => ({
  Accept: '*/*',
})

export const generateUUID = (): string => v4()

export const getTextContentTypeFromBodyType = (
  type: RequestBody['type'],
): string => {
  switch (type) {
    case 'json':
      return 'application/json'
    case 'xml':
      return 'application/xml'
    case 'plain-text':
      return 'text/plain'
    case 'yaml':
      return 'application/x-yaml'
    case 'edn':
      return 'application/edn'
    case 'file':
      return 'application/octet-stream'
    case 'form-data':
      return 'multipart/form-data'
    case 'x-www-form-urlencoded':
      return 'application/x-www-form-urlencoded'
    default:
      return 'application/json'
  }
}

const forbiddenHeaderNames = {
  is: [
    'Accept',
    'Accept-Encoding',
    'Accept-Language',
    'Connection',
    'Content-Length',
    'Cookie',
    'Host',
    'Origin',
    'Referer',
    'Transfer-Encoding',
    'TE',
    'Upgrade',
    'Via',
  ],
  startWith: ['Proxy-', 'Sec-'],
}

export const isHeaderForbidden = (headerName?: string): boolean => {
  if (!headerName) return false

  const lowerCasedName = headerName?.toLowerCase()

  if (
    forbiddenHeaderNames.is.some(
      (name) => lowerCasedName === name.toLowerCase(),
    )
  ) {
    return true
  }

  if (
    forbiddenHeaderNames.startWith.some((name) =>
      lowerCasedName.startsWith(name.toLowerCase()),
    )
  ) {
    return true
  }

  return false
}

export const generateNewRequestTemplate = (): FileSystemNode => ({
  id: generateUUID(),
  name: 'New Request',
  isFolder: false,
  request: {
    url: '',
    headers: [
      {
        id: 'c3b9e7a3-4d36-4d97-9106-ac50c833b700',
        key: 'X-Client-Version',
        value: 'hypersomnia/0.0.1',
        enabled: true,
      },
    ],
    options: {
      method: 'get',
    },
  },
})

export const generateNewFolderTemplate = (): FileSystemNode => ({
  id: generateUUID(),
  name: 'New Folder',
  isFolder: true,
  children: [],
})

const insertFileAtPath = (
  fileSystem: FileSystemNode[],
  path: string[],
  file: FileSystemNode,
): FileSystemNode[] => {
  return fileSystem.map((node) => {
    if (path.length === 2) {
      if (node.id === path[0]) {
        const duplicatedIndex = node.children?.findIndex(
          (child) => child.id === path[1],
        )

        if (duplicatedIndex === -1 || duplicatedIndex === undefined) {
          return {
            ...node,
            children: [file, ...(node.children || [])],
          }
        }

        const updatedChildren = [
          ...(node.children?.slice(0, duplicatedIndex + 1) || []),
          file,
          ...(node.children?.slice(duplicatedIndex + 1) || []),
        ]

        return {
          ...node,
          children: updatedChildren,
        }
      }
      return node
    }

    if (node.isFolder && node.children) {
      return {
        ...node,
        children: insertFileAtPath(node.children, path.slice(1), file),
      }
    }

    return node
  })
}

export const insertFile = (
  fileSystem: FileSystemNode[],
  path: string[],
  file: FileSystemNode,
) => {
  switch (path.length) {
    case 0:
      return [file, ...fileSystem]
    case 1: {
      const duplicatedIndex = fileSystem.findIndex(
        (node) => node.id === path[0],
      )

      if (duplicatedIndex === -1) {
        return [...fileSystem, file]
      }

      const updatedFileSystem = [
        ...fileSystem.slice(0, duplicatedIndex + 1),
        file,
        ...fileSystem.slice(duplicatedIndex + 1),
      ]

      return updatedFileSystem
    }
    default: {
      return insertFileAtPath(fileSystem, path, file)
    }
  }
}
