import {useRef, useMemo, useState} from 'react'
import * as ui from '@adobe/react-spectrum'
import {PalSelect, getPalOptions, type PalSelectProps} from './PalSelect'
import {type Pal} from './lib/pals'
import useI18n from './lib/useI18n'
import type {PalName} from './lib/palNames'

type PalSelectOptionItem = {
  id: string
  name: string
  pal: Pal
}

export const PalMultiSelect = (props: PalSelectProps) => {
  const t = useI18n()
  const [selectedKeys, setKeys] = useState(() => new Set<PalName>())
  const {tags, options} = useMemo(() => {
    return {
      tags: [...selectedKeys].map(key => ({id: key, name: key})),
      options: getPalOptions(t).filter(x => !selectedKeys.has(x.id)),
    }
  }, [t, selectedKeys])
  const hiddenRef = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLDivElement>(null)

  return (
    <ui.Flex wrap="wrap">
      <div tabIndex={-1} ref={hiddenRef} />
      <ui.TagGroup
        aria-label="TagGroup"
        items={tags}
        onRemove={keys => {
          const newKeys = new Set(selectedKeys)
          keys.forEach(key => {
            newKeys.delete(key)
          })
          setKeys(newKeys)
        }}
      >
        {item => <ui.Item>{item.name}</ui.Item>}
      </ui.TagGroup>
      <PalSelect
        aria-label="Pal filter"
        isQuiet
        ref={ref}
        {...props}
        defaultItems={options}
        onSelectionChange={key => {
          setKeys(new Set([...selectedKeys, key]))
          // ComoBox does not support MultipleSelection
          setTimeout(() => {
            console.info('focus', hiddenRef.current, ref.current)
            hiddenRef.current?.focus()
            setTimeout(() => {
              ref.current?.focus()
            }, 0)
          }, 0)
        }}
      />
    </ui.Flex>
  )
}
