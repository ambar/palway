import * as ui from '@adobe/react-spectrum'
import Remove from '@spectrum-icons/workflow/Remove'
import {useMemo, useRef, useState} from 'react'
import {PalSelect, type PalSelectProps, getPalOptions} from './PalSelect'
import type {PalName} from './lib/palNames'
import type {Pal} from './lib/pals'
import useI18n from './lib/useI18n'

type PalMultiSelectProps = PalSelectProps & {
  defaultSelectedKeys?: Set<PalName>
  onSelectionChange?: (keys: Set<PalName>) => void
}

export const PalMultiSelect = ({
  defaultSelectedKeys = new Set<PalName>(),
  onSelectionChange,
  ...props
}: PalMultiSelectProps) => {
  const t = useI18n()
  const [selectedKeys, setKeys] = useState(() => defaultSelectedKeys)
  const {tags, options} = useMemo(() => {
    return {
      tags: [...selectedKeys].map(key => ({id: key, name: key})),
      options: getPalOptions(t).filter(x => !selectedKeys.has(x.id)),
    }
  }, [t, selectedKeys])
  const hiddenRef = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLDivElement>(null)

  return (
    <>
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
        label="Filter"
        labelPosition="side"
        aria-label="Filter"
        isQuiet
        ref={ref}
        {...props}
        defaultItems={options}
        onSelectionChange={key => {
          const newKeys = new Set([...selectedKeys, key])
          setKeys(newKeys)
          onSelectionChange?.(newKeys)
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
      <Remove />
    </>
  )
}
