const unfold = <T = void>(list: T, fn: (x: T) => T) => {
  const ret: T[] = []
  let last: T = list
  while (last) {
    ret.push(last)
    last = fn(last)
  }
  return ret
}

export default unfold
