import {expect, test} from 'vitest'
import {combineParent} from '../breed'
import type {PalName} from '../palNames'
import {normalPalsByName, normalPalsSortedByCombiRank} from '../pals'
import product from '../product'

const expectBreed = (a: PalName, b: PalName, expected: string | null) => {
  const result = combineParent(normalPalsByName[a], normalPalsByName[b])
  expect(result?.pal_name).toBe(expected)
}

const combos: [PalName, PalName, PalName][] = [
  // normal combos
  ['Anubis', 'Mau', 'Galeclaw'],
  ['Rushoar', 'Blazamut', 'Anubis'],

  // should not be Boss (Jetragon etc)
  ['Orserk', 'Suzaku', 'Cryolinx'],

  // tie-breaker
  ['Wixen', 'Wumpo', 'Dinossom'],
  ['Vaelet', 'Wumpo', 'Tombat'],
  ['Lamball', 'Penking', 'Verdash'],

  // unique combos
  ['Lyleen', 'Menasting', 'Lyleen Noct'],
  ['Astegon', 'Kitsun', 'Shadowbeak'],
  ['Jormuntide', 'Blazehowl', 'Jormuntide Ignis'], // new in v0.2.0.6
]

test.each(combos)('%s + %s = %s', (a, b, r) => {
  expectBreed(a, b, r)
})

// test('all combos', () => {
//   const result = product(
//     normalPalsSortedByCombiRank,
//     normalPalsSortedByCombiRank,
//   ).map(([a, b]) => {
//     const r = combineParent(a, b)
//     return `${a.pal_name} + ${b.pal_name} = ${r?.pal_name}`
//   })
//   expect(result).toMatchSnapshot()
// })
