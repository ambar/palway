import pals from '../data/pals.json'
import type {PalName} from './palNames'

// all: 314
// is_available_ingame: 299
// is_boss: 160
// is_tower_boss / pal_index=-2: 5
// pal_index=-1: 172
// !x.is_boss && pal_index=-1: 17 (under investigation)

/**
 * Normal pals sorted by index
 * Lamball #1 to Jetragon #111
 */
export const normalPals: NormalPal[] = pals
  // filtered: 137
  .filter(
    pal =>
      pal.is_available_ingame &&
      !pal.is_boss &&
      !pal.is_tower_boss &&
      pal.pal_index !== '-1',
  )
  .sort((a, b) => parseInt(a.pal_index) - parseInt(b.pal_index))

/**
 * Normal pals sorted by combi_rank,
 * Blazamut 10 to Chikipi 1500
 */
export const normalPalsSortedByCombiRank = normalPals
  .slice()
  .sort((a, b) => a.combi_rank - b.combi_rank)

type PalsByName = Record<PalName, Pal>
export const normalPalsByName: PalsByName = normalPals.reduce((acc, pal) => {
  acc[pal.pal_name as PalName] = pal
  return acc
}, {} as PalsByName)

export type Pal = (typeof pals)[0]
export type NormalPal = (typeof pals)[0] & {
  pal_name: PalName
}
