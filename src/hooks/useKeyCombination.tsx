import { useEffect, useRef } from 'react'

export type KeyCombination = {
  keys: string[]
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
}

const useKeyCombination = (
  keyCombinations: KeyCombination[],
  callback: () => void,
) => {
  const pressedKeys = useRef<Set<string>>(new Set())
  const alreadyRan = useRef(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement

      if (
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.getAttribute('contenteditable') === 'true')
      ) {
        return
      }

      if (!pressedKeys.current.has(event.key)) {
        pressedKeys.current.add(event.key)
      }

      keyCombinations.forEach(
        ({ keys, ctrlKey = false, altKey = false, shiftKey = false }) => {
          const allKeysPressed = keys.every((key) =>
            pressedKeys.current.has(key),
          )

          if (
            allKeysPressed &&
            event.ctrlKey === ctrlKey &&
            event.altKey === altKey &&
            event.shiftKey === shiftKey &&
            !alreadyRan.current
          ) {
            event.preventDefault()
            callback()
            alreadyRan.current = true
          }
        },
      )
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      alreadyRan.current = false

      const newSet = new Set(pressedKeys.current)
      newSet.delete(event.key)
      pressedKeys.current = newSet
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [keyCombinations, callback])
}

export default useKeyCombination
