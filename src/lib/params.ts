import {useAtom} from 'jotai'
import {atomWithLocation} from 'jotai-location'
import {useCallback, useMemo, useRef, useState} from 'react'

const locationAtom = atomWithLocation()

export const useBooleanParam = (key: string, defaultValue = false) => {
  const [{searchParams}, setLoc] = useAtom(locationAtom)
  const value = useMemo(() => {
    const v = searchParams?.get(key)
    return (v ? v !== '0' : undefined) ?? defaultValue
  }, [key, searchParams, defaultValue])
  const setValue = useCallback(
    (value: boolean) => {
      setLoc(loc => {
        const searchParams = new URLSearchParams(loc.searchParams)
        if (value === defaultValue) {
          searchParams.delete(key)
        } else {
          searchParams.set(key, String(Number(value)))
        }
        return {...loc, searchParams}
      })
    },
    [setLoc, defaultValue, key],
  )
  return [value, setValue] as const
}

export const useEnumParam = <T extends string>(
  key: string,
  valueSet: Set<T>,
  defaultValue: T | null = null,
) => {
  const [{searchParams}, setLoc] = useAtom(locationAtom)
  const value = useMemo(() => {
    const v = searchParams?.get(key)
    return v && valueSet.has(v as T) ? (v as T) : defaultValue
  }, [key, defaultValue, searchParams, valueSet])
  const setValue = useCallback(
    (value: T) => {
      setLoc(loc => {
        const searchParams = new URLSearchParams(loc.searchParams)
        if (valueSet.has(value)) {
          searchParams.set(key, value)
        } else {
          searchParams.delete(key)
        }
        return {...loc, searchParams}
      })
    },
    [key, setLoc, valueSet],
  )
  return [value, setValue] as const
}
