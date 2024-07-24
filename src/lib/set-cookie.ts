'use server'

import { cookies } from 'next/headers'

export default async function setCookie(key: string, value: unknown) {
  cookies().set(key, JSON.stringify(value))
}
