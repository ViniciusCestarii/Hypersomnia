import { cookies } from 'next/headers'

export function getCookie(key: string) {
  const cookie = cookies().get(key)
  return cookie ? JSON.parse(cookie.value) : null
}
