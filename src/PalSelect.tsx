import * as ui from '@adobe/react-spectrum'
// import {useTreeData} from 'react-stately'
import {normalPals, type Pal} from './lib/pals'
import getPalIcon from './lib/getPalIcon'

type PalSelectOptionItem = {
  id: string
  name: string
  pal: Pal
}

const getPalSelectOptionName = (pal: Pal) => `${pal.pal_name} #${pal.pal_index}`

// index/name is added to the options to make it easier to find the selected item
const options = normalPals.map(pal => ({
  id: pal.pal_name,
  name: getPalSelectOptionName(pal),
  pal,
}))

export const PalSelect = (
  props: Omit<ui.SpectrumComboBoxProps<PalSelectOptionItem>, 'children'>,
) => {
  return (
    <ui.Flex direction="row" gap="size-100" wrap>
      <ui.ComboBox
        defaultItems={options}
        menuTrigger="focus"
        width="auto"
        // Spectrum has no way to set the height of the ComboBox, can only set the `scale` prop on the Provider
        maxWidth="100%"
        // TODO: set side label position on mobile
        // labelPosition="side"
        {...props}
      >
        {item => {
          const imgSrc = getPalIcon(item.pal.pal_dev_name)
          // ComboBox 40x40 in large scale, 32x32 in medium scale
          const imgSize = 40 // * 0.8
          // Spectrum can't set loading="lazy" on the Image or Avatar
          const icon = (
            <img
              width={imgSize}
              height={imgSize}
              src={imgSrc}
              alt={item.name}
              loading="lazy"
              style={{borderRadius: 9999, objectFit: 'cover', display: 'block'}}
            />
          )
          // slots ref:
          // https://github.com/adobe/react-spectrum/blob/main/packages/%40react-spectrum/menu/src/MenuItem.tsx#L126
          return (
            <ui.Item key={item.id} textValue={item.name}>
              <ui.Text slot="icon">{icon}</ui.Text>
              <ui.Text>{item.pal.pal_name}</ui.Text>
              <ui.Text
                slot="description"
                UNSAFE_style={{fontSize: '.85em', opacity: 0.7}}
              >
                #{item.pal.pal_index}
              </ui.Text>
            </ui.Item>
          )
        }}
      </ui.ComboBox>
    </ui.Flex>
  )
}