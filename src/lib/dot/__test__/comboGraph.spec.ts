import {expect, test} from 'vitest'
import {makeComboGraph} from '../comboGraph'

test('makeComboGraph', () => {
  expect(
    makeComboGraph([['Cattiva', 'Lifmunk']], 'Vixy', v => v),
  ).toMatchSnapshot()
})
