import {combineParent} from './breed'
import type {PalName} from './palNames'
import {type Pal, normalPals} from './pals'
// import combos from '../data/combos.json'

type CombosMap = Map<PalName, Map<PalName, PalName | null>>

const sortPalName = (a: PalName, b: PalName): [PalName, PalName] => {
  if (a.localeCompare(b) > 0) {
    return [b, a]
  }
  return [a, b]
}

// precomputing all combos
export const getAllCombosMap = (dedupe = false) => {
  const map: CombosMap = new Map()
  for (const a of normalPals) {
    for (const b of normalPals) {
      // dedupe by sorting the names and using the sorted names as the key
      // 18769 -> 9453
      const [nameA, nameB] = dedupe
        ? sortPalName(a.pal_name, b.pal_name)
        : ([a.pal_name, b.pal_name] as [PalName, PalName])
      const value = (combineParent(a, b)?.pal_name as PalName) ?? null
      if (!map.has(nameA)) {
        map.set(nameA, new Map())
      }
      map.get(nameA)!.set(nameB, value)
    }
  }
  return map
}

export const dedupedCombosMap: CombosMap = getAllCombosMap(true)
// reverse map
export const combosMapByChildName = new Map<PalName, [PalName, PalName][]>()
export const fullCombosMap: CombosMap = new Map()

for (const [a, bMap] of dedupedCombosMap) {
  if (!fullCombosMap.has(a)) {
    fullCombosMap.set(a, new Map())
  }
  for (const [b, c] of bMap) {
    if (!fullCombosMap.has(b)) {
      fullCombosMap.set(b, new Map())
    }
    fullCombosMap.get(a)!.set(b, c)
    fullCombosMap.get(b)!.set(a, c)

    if (!combosMapByChildName.has(c)) {
      combosMapByChildName.set(c, [])
    }
    combosMapByChildName.get(c)!.push([a, b])
  }
}

// export const dedupedCombosMap: CombosMap = new Map()
// // non-deduped map
// export const fullCombosMap: CombosMap = new Map()

// for (const [a, b, c] of combos as [PalName, PalName, PalName][]) {
//   if (!dedupedCombosMap.has(a)) {
//     dedupedCombosMap.set(a, new Map())
//   }
//   dedupedCombosMap.get(a)!.set(b, c)

//   if (!fullCombosMap.has(a)) {
//     fullCombosMap.set(a, new Map())
//   }
//   fullCombosMap.get(a)!.set(b, c)
//   if (!fullCombosMap.has(b)) {
//     fullCombosMap.set(b, new Map())
//   }
//   fullCombosMap.get(b)!.set(a, c)
// }

// export const getCombo = (a: PalName, b: PalName): PalName | null => {
//   ;[a, b] = sortPalName(a, b)
//   return dedupedCombosMap.get(a)?.get(b) ?? null
// }

export const getCombo = (a: PalName, b: PalName): PalName | null => {
  return fullCombosMap.get(a)?.get(b) ?? null
}

type ParentPair = [PalName, PalName]
export const findReverseParents = (
  childName: PalName,
  filter?: (parents: ParentPair) => boolean,
): ParentPair => {
  let results = combosMapByChildName.get(childName)
  if (filter) {
    results = results?.filter(filter)
  }
  return results || []
}
