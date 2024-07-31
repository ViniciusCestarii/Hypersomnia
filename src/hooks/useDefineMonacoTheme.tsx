import { useMonaco } from '@monaco-editor/react'
import { useRef } from 'react'

const useDefineMonacoTheme = () => {
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
}

export default useDefineMonacoTheme
