import { generateEditorDefaultProps } from '@/lib/utils'
import {
  EditorProps,
  Editor as MonacoEditor,
  useMonaco,
} from '@monaco-editor/react'
import { useTheme } from 'next-themes'
import { useMemo, useRef } from 'react'

const Editor = (props: EditorProps) => {
  const theme = useTheme()
  const monaco = useMonaco()

  const isThemeDefined = useRef<boolean>(false)

  if (monaco && !isThemeDefined.current) {
    monaco.editor.defineTheme('dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#0A0A0A',
      },
    })
    isThemeDefined.current = true
  }

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
