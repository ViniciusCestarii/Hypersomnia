import Editor from '@/components/ui/panel/editor'
import { formatHtmlContent } from '@/lib/utils'
import { BodyTypeText } from '@/types'
import useHypersomniaStore from '@/zustand/hypersomnia-store'

interface BodyDataType {
  text: string
  type: BodyTypeText | 'html'
}

const getDataText = (data: unknown): BodyDataType | undefined => {
  if (typeof data === 'string' && data.length > 0) {
    if (data.trimStart().toUpperCase().startsWith('<!DOCTYPE HTML')) {
      return {
        text: formatHtmlContent(data),
        type: 'html',
      }
    }

    return {
      text: data,
      type: 'plain-text',
    }
  }
  if (typeof data === 'object' && data) {
    return {
      text: JSON.stringify(data, null, 2),
      type: 'json',
    }
  }
}

const ResponseBodyTab = () => {
  const { data } =
    useHypersomniaStore((state) => state.requestFetchResult) ?? {}

  const dataText = getDataText(data)

  if (!dataText) {
    return null
  }
  // todo: only if body is on mode preview

  // sanitize html first see https://github.com/cure53/DOMPurify
  // if (dataText.type === 'html') {
  //   return <div dangerouslySetInnerHTML={{ __html: dataText.text }} />
  // }

  return (
    <Editor
      language={dataText.type}
      value={dataText.text}
      height="calc(100% - 2.5rem)"
      options={{
        readOnly: true,
        domReadOnly: true,
      }}
    />
  )
}

export default ResponseBodyTab
