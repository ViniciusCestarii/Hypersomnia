import Editor from '@/components/ui/panel/editor'
import { formatHtmlContent } from '@/lib/utils'
import { BodyTypeText } from '@/types/collection'
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

  return (
    <Editor
      language={dataText.type}
      value={dataText.text}
      options={{
        readOnly: true,
        domReadOnly: true,
      }}
    />
  )
}

export default ResponseBodyTab
