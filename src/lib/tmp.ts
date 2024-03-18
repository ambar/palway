import {useEffect} from 'react'
import {useLocation, useNavigate} from 'rspress/runtime'

type Path = {pathname: string; search: string}
let prev: Path[] = []

// TODO: should be handled in rspress
export const usePreserveSearchParams = () => {
  const {pathname, search} = useLocation()

  useEffect(() => {
    const last = prev[prev.length - 1]
    if (!last) {
      prev.push({pathname, search})
    } else if (last.pathname !== pathname || last.search !== search) {
      prev = [last, {pathname, search}]
    }
  }, [pathname, search])

  const navigate = useNavigate()
  useEffect(() => {
    if (prev.length === 2) {
      navigate(prev[0].search, {replace: true})
    }
  }, [navigate])
}
