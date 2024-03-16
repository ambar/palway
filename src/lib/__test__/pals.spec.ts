import {expect, test} from 'vitest'
import {normalPals, normalPalsSortedByCombiRank} from '../pals'

test('normalPalsSortedByCombiRank', () => {
  expect(normalPalsSortedByCombiRank[0].pal_name).toMatchInlineSnapshot(
    `"Blazamut"`,
  )
  expect(
    normalPalsSortedByCombiRank[normalPalsSortedByCombiRank.length - 1]
      .pal_name,
  ).toMatchInlineSnapshot(`"Chikipi"`)
})

test('normalPals', () => {
  expect(normalPals.length).toMatchInlineSnapshot('137')
  expect(normalPals[0].pal_name).toMatchInlineSnapshot(`"Lamball"`)
  expect(normalPals[normalPals.length - 1].pal_name).toMatchInlineSnapshot(
    `"Jetragon"`,
  )
})
