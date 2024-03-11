import * as ui from '@adobe/react-spectrum'
import {forwardRef, useMemo} from 'react'
import getPalIcon from './lib/getPalIcon'
// import {useTreeData} from 'react-stately'
import {type Pal, normalPals} from './lib/pals'
import useI18n from './lib/useI18n'
import type {PalName} from './lib/palNames'

type PalSelectOptionItem = {
  id: PalName
  name: string
  pal: Pal
}

export const getPalOptions = (
  t: ReturnType<typeof useI18n>,
): PalSelectOptionItem[] => {
  return normalPals.map(pal => ({
    id: pal.pal_name,
    name: `${t(`palName_${pal.pal_dev_name}`)} #${pal.pal_index}`,
    pal,
  }))
}

export type PalSelectProps = Omit<
  ui.SpectrumComboBoxProps<PalSelectOptionItem>,
  'children'
>

export const PalSelect = forwardRef<unknown, PalSelectProps>((props, ref) => {
  const t = useI18n()
  const options = useMemo(() => {
    return getPalOptions(t)
  }, [t])

  return (
    <ui.Flex direction="row" gap="size-100" wrap>
      <ui.ComboBox
        ref={ref}
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
              style={{
                borderRadius: 9999,
                objectFit: 'cover',
                display: 'block',
              }}
            />
          )
          // slots ref:
          // https://github.com/adobe/react-spectrum/blob/main/packages/%40react-spectrum/menu/src/MenuItem.tsx#L126
          return (
            <ui.Item key={item.id} textValue={item.name}>
              <ui.Text slot="icon">{icon}</ui.Text>
              <ui.Text>{t(`palName_${item.pal.pal_dev_name}`)}</ui.Text>
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
})
