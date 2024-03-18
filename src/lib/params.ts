import {
  type Dispatch,
  type SetStateAction,
  createContext,
  createElement,
  useCallback,
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react'
// alias of react-router-dom
import {useLocation, useNavigate} from 'rspress/runtime'

const SharedSearchParamsContext = createContext<
  [URLSearchParams, Dispatch<SetStateAction<URLSearchParams>>]
>([])

const useSharedSearchParams = () => {
  return useContext(SharedSearchParamsContext)
}

const isSameSearchParams = <T extends string | URLSearchParams>(a: T, b: T) => {
  if (a === b) {
    return true
  }
  const uspA = new URLSearchParams(a)
  const uspB = new URLSearchParams(b)
  uspA.sort()
  uspB.sort()
  return uspA.toString() === uspB.toString()
}

// RR's useSearchParams is bugged, location.search/searchParams are not in sync
const useURLSearchParamsFixed = () => {
  const location = useLocation()
  const [searchParams, setSearchParams] = useState(
    () => new URLSearchParams(location.search),
  )

  const navigate = useNavigate()
  const deferredParams = useDeferredValue(searchParams)
  useEffect(() => {
    navigate(`?${deferredParams}`)
  }, [deferredParams, navigate])

  const deferredSearch = useDeferredValue(location.search)
  const searchParamsRef = useRef(searchParams)
  searchParamsRef.current = searchParams
  useEffect(() => {
    const params = new URLSearchParams(deferredSearch)
    if (!isSameSearchParams(params, searchParamsRef.current)) {
      setSearchParams(params)
    }
  }, [deferredSearch])

  return [searchParams, setSearchParams] as const
}

type Props = {
  children: React.ReactNode
}

export const HistoryProvider = ({children}: Props) => {
  const [searchParams, setSearchParams] = useURLSearchParamsFixed()
  return createElement(SharedSearchParamsContext.Provider, {
    children,
    value: useMemo(
      () => [searchParams, setSearchParams],
      [searchParams, setSearchParams],
    ),
  })
}

export const useBooleanParam = (key: string, defaultValue = false) => {
  const [searchParams, setSearchParams] = useSharedSearchParams()
  const value = useMemo(() => {
    const v = searchParams?.get(key)
    return (v ? v !== '0' : undefined) ?? defaultValue
  }, [key, searchParams, defaultValue])
  const setValue = useCallback(
    (value: boolean) => {
      setSearchParams(prev => {
        const searchParams = new URLSearchParams(prev)
        if (value === defaultValue) {
          searchParams.delete(key)
        } else {
          searchParams.set(key, String(Number(value)))
        }
        return searchParams
      })
    },
    [setSearchParams, defaultValue, key],
  )
  return [value, setValue] as const
}

export const useEnumParam = <T extends string>(
  key: string,
  valueSet: Set<T>,
  defaultValue: T | null = null,
) => {
  const [searchParams, setSearchParams] = useSharedSearchParams()
  const value = useMemo(() => {
    const v = searchParams?.get(key)
    return v && valueSet.has(v as T) ? (v as T) : defaultValue
  }, [key, defaultValue, searchParams, valueSet])
  const setValue = useCallback(
    (value: T | null) => {
      setSearchParams(prev => {
        const searchParams = new URLSearchParams(prev)
        if (value && valueSet.has(value)) {
          searchParams.set(key, value)
        } else {
          searchParams.delete(key)
        }
        return searchParams
      })
    },
    [key, setSearchParams, valueSet],
  )
  return [value, setValue] as const
}
