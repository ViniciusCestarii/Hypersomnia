import setCookie from '@/lib/set-cookie'
import { useState, useRef } from 'react'

/**
 * A custom hook for managing cookies.
 *
 * @param {string} key - The key under which the value is stored in the cookie.
 * @param {T} initialValue - The initial value to be used if there is no value in the cookie.
 * @returns {[T, Function]} - An array with the stored value and a function to update it.
 */
const useCookieStorage = <T,>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function
          ? (value as (val: T) => T)(storedValue)
          : value

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setCookie(key, valueToStore)
      }, 300)

      setStoredValue(valueToStore)
    } catch (error) {
      console.error('Error setting cookie value:', error)
    }
  }

  return [storedValue, setValue]
}

export default useCookieStorage
