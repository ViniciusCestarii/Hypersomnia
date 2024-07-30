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
    if (data.trimStart().startsWith('<!DOCTYPE html>')) {
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
  const { data, error, loading } =
    useHypersomniaStore((state) => state.requestFetchResult) ?? {}

  const dataText = getDataText(data)

  return (
    <div className="relative h-[80vh]">
      {loading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center bg-background/35 z-50">
          Loading...
        </div>
      )}
      {!error && dataText && (
        <Editor
          language={dataText.type}
          value={dataText.text}
          options={{
            readOnly: true,
            domReadOnly: true,
          }}
        />
      )}
    </div>
  )
}

export default ResponseBodyTab
