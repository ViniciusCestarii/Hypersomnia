import { useState } from 'react'

/**
 * A custom hook for managing local storage.
 *
 * @param {string} key - The key under which the value is stored in local storage.
 * @param {T} initialValue - The initial value to be used if there is no value in local storage.
 * @returns {[T, Function]} - An array with the stored value and a function to update it.
 */
const useLocalStorage = <T,>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] => {
  const getStoredValue = (): T => {
    if (typeof window === 'undefined') return initialValue

    const storedValue = window.localStorage.getItem(key)
    if (storedValue) {
      try {
        return JSON.parse(storedValue) as T
      } catch (error) {
        console.error('Error parsing local storage value:', error)
        return initialValue
      }
    }
    return initialValue
  }

  const [storedValue, setStoredValue] = useState<T>(getStoredValue)

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function
          ? (value as (val: T) => T)(storedValue)
          : value

      window.localStorage.setItem(key, JSON.stringify(valueToStore))

      setStoredValue(valueToStore)
    } catch (error) {
      console.error('Error setting local storage value:', error)
    }
  }

  return [storedValue, setValue]
}

export default useLocalStorage
