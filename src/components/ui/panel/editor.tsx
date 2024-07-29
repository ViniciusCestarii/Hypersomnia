import { generateEditorDefaultProps } from '@/lib/utils'
import { EditorProps, Editor as MonacoEditor } from '@monaco-editor/react'
import { useTheme } from 'next-themes'
import { useMemo } from 'react'

const Editor = (props: EditorProps) => {
  const theme = useTheme()

  const editorDefaultProps: EditorProps = useMemo(
    () =>
      generateEditorDefaultProps({
        theme: theme.theme,
      }),
    [theme.theme],
  )

  return (
    <MonacoEditor
      {...editorDefaultProps}
      {...props}
      options={{
        ...editorDefaultProps.options,
        ...props?.options,
      }}
    />
  )
}

export default Editor
