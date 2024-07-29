import { EditorProps, Editor as MonacoEditor } from '@monaco-editor/react'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { editor as MonacoEditorAPI } from 'monaco-editor'
import { generateEditorDefaultProps } from '@/lib/utils'

const ReadOnlyEditor = (props: EditorProps) => {
  const theme = useTheme()
  const editorRef = useRef<MonacoEditorAPI.IStandaloneCodeEditor | null>(null)

  const editorDefaultProps: EditorProps = useMemo(
    () =>
      generateEditorDefaultProps({
        theme: theme.theme,
      }),
    [theme.theme],
  )

  const formatCode = useCallback(async () => {
    const editor = editorRef.current
    if (editor) {
      await editor.getAction('editor.action.formatDocument')?.run()
      editor.setScrollTop(0)
    }
  }, [])

  useEffect(() => {
    const updateEditor = async () => {
      await formatCode()
    }
    updateEditor()
  }, [formatCode, props.value, props.language])

  return (
    <MonacoEditor
      {...editorDefaultProps}
      {...props}
      options={{
        ...editorDefaultProps.options,
        ...props?.options,
      }}
      onMount={(editor) => {
        editorRef.current = editor
      }}
    />
  )
}

export default ReadOnlyEditor
