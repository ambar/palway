import {expect, test} from 'vitest'
import staticCombos from '../../data/combos.json'
import {dedupedCombosMap, fullCombosMap, getCombo} from '../combos'
import type {PalName} from '../palNames'

test('sort key', () => {
  expect(getCombo('Anubis', 'Arsox')).toBe(getCombo('Arsox', 'Anubis'))
})

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
]

test.each(combos)('%s + %s = %s', (a, b, r) => {
  expect(getCombo(a, b)).toBe(r)
})

const getSize = (map: Map<PalName, Map<PalName, PalName | null>>) => {
  return [...map.values()].flatMap(x => [...x.values()]).length
}

test('map size', () => {
  expect(staticCombos.length).toBe(9453)
  expect(getSize(dedupedCombosMap)).toBe(9453)
  expect(getSize(fullCombosMap)).toBe(18769)
})
