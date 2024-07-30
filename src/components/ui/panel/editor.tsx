import { generateEditorDefaultProps } from '@/lib/utils'
import {
  EditorProps,
  Editor as MonacoEditor,
  useMonaco,
} from '@monaco-editor/react'
import { useTheme } from 'next-themes'
import { useMemo } from 'react'

const Editor = (props: EditorProps) => {
  const theme = useTheme()
  const monaco = useMonaco()

  monaco?.editor.defineTheme('dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#0A0A0A',
    },
  })

  const editorDefaultProps: EditorProps = useMemo(
    () =>
      generateEditorDefaultProps({
        theme: theme.resolvedTheme,
      }),
    [theme.resolvedTheme],
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
