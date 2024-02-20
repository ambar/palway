const product = <T>(a: T[], b: T[]) => {
  const result: [T, T][] = []
  for (const x of a) {
    for (const y of b) {
      result.push([x, y])
    }
  }
  return result
}

export default product
