import type { Middleware, UnknownAction } from '@reduxjs/toolkit'
import stringify from 'fast-json-stable-stringify'

export const storageMiddleware: Middleware = store => next => (action) => {
  const result = next(action)
  if ((action as UnknownAction).type?.startsWith('storage/')) {
    const storageState = store.getState().storage
    localStorage.setItem('userPreferences', stringify(storageState))
  }

  return result
}
