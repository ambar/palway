import {test, expect} from 'vitest'
import getPalIcon from '../getPalIcon'
import {normalPalsByName} from '../pals'

test('getPalIcon', () => {
  expect(
    getPalIcon(normalPalsByName['Anubis'].pal_dev_name),
  ).toMatchInlineSnapshot(`"/src/assets/images/pal_icons_200w/T_Anubis_icon_normal.png"`)
})
