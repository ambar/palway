import {normalPalsSortedByCombiRank, normalPalsByName, type Pal} from './pals'
import uniqueCombos from '../data/uniqueCombos.json'
import type {PalName} from './palNames'
import {tieBreakerOrderMap} from './tieBreaker'

const uniqueCombosByChildName = uniqueCombos.reduce(
  (acc, x) => {
    const name = x.ResultName as PalName
    acc[name] = x
    return acc
  },
  {} as Record<PalName, (typeof uniqueCombos)[0]>,
)
const isUnique = (pal: Pal) => pal.pal_name in uniqueCombosByChildName

const bossSet = new Set([
  'Frostallion',
  'Jetragon',
  'Paladius',
  'Necromus',
  'Jormuntide Ignis',
])
const isBoss = (pal: Pal) => bossSet.has(pal.pal_name)

// pals that can be combined from different parents
const combinable = normalPalsSortedByCombiRank.filter(
  (pal: Pal) => !isUnique(pal) && !isBoss(pal),
)

const findClosestByRank = (rank: number): Pal | null => {
  const first = normalPalsSortedByCombiRank[0]
  const last =
    normalPalsSortedByCombiRank[normalPalsSortedByCombiRank.length - 1]
  if (first.combi_rank > last.combi_rank) {
    throw new Error('combi_rank is not sorted')
  }
  if (rank <= first.combi_rank) {
    return first
  }
  if (rank >= last.combi_rank) {
    return last
  }
  for (let i = 0; i < combinable.length; i++) {
    const pal = combinable[i]
    if (rank === pal.combi_rank) {
      return pal
    }
    const next = combinable[i + 1]
    if (!next) {
      return pal
    }
    if (rank === next.combi_rank) {
      return next
    }
    if (rank >= pal.combi_rank && rank < next.combi_rank) {
      const diff =
        Math.abs(rank - pal.combi_rank) - Math.abs(next.combi_rank - rank)
      if (diff === 0) {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const palIndex = tieBreakerOrderMap.get(pal.pal_name as PalName)!
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const nextIndex = tieBreakerOrderMap.get(next.pal_name as PalName)!
        return palIndex < nextIndex ? pal : next
      }
      if (diff < 0) {
        return pal
      }
      return next
    }
  }
  return null
}

/**
 * Prefer use `getCombo` instead
 * @see https://www.reddit.com/r/Palworld/comments/19d98ws/spreadsheet_all_breeding_combinations_datamined/
 */
export const combineParent = (a: Pal, b: Pal): Pal | null => {
  if (!a || !b) {
    return null
  }
  if (a.pal_name === b.pal_name) {
    return a
  }
  const unique = combineParentUnique(
    a.pal_name as PalName,
    b.pal_name as PalName,
  )
  if (unique) {
    return normalPalsByName[unique]
  }
  const rank = Math.floor((a.combi_rank + b.combi_rank + 1) / 2)
  return findClosestByRank(rank)
}

export const combineParentUnique = (a: PalName, b: PalName) => {
  const result = uniqueCombos.find(
    x =>
      (x.Parent1Name === a && x.Parent2Name === b) ||
      (x.Parent1Name === b && x.Parent2Name === a),
  )
  return result ? (result.ResultName as PalName) : null
}
