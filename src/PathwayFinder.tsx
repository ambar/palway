import {useEffect, useState} from 'react'
// https://spectrum.adobe.com/page/icons/
import * as ui from '@adobe/react-spectrum'
import {PalSelect} from './PalSelect'
import {PalName} from './lib/palNames'
import {findReverseParents, getCombo} from './lib/combos'
import {FlowGraph, makeGraph} from './dot'

type SelectedKey = PalName

/**
 * Breading calculator for Palworld
 */
const PathwayFinder = () => {
  const [parent1, setParent1] = useState<SelectedKey>()
  const [parent2, setParent2] = useState<SelectedKey>()
  const [child, setChild] = useState<SelectedKey>()

  const [graph, setGraph] = useState('')

  useEffect(() => {
    if (parent1 && parent2) {
      const childName = getCombo(parent1, parent2)
      if (!childName) {
        setChild(undefined)
        return
      }
      setChild(childName)
      setGraph(makeGraph([[parent1, parent2]], childName))
      return
    }

    if (child && !parent1 && !parent2) {
      const parents = findReverseParents(child)
      setGraph(makeGraph(parents, child))
      return
    }

    const parent = parent1 || parent2
    if (child && parent) {
      const parents = findReverseParents(child, p => p.includes(parent))
      console.info({parents, child})
      setGraph(makeGraph(parents, child))
      return
    }
  }, [parent1, parent2, child])

  return (
    <ui.View>
      <ui.Form
        validationBehavior="native"
        onReset={() => {
          setParent1('')
          setParent2('')
          setChild('')
          setGraph('')
        }}
        UNSAFE_style={{
          margin: 'auto 1em',
        }}
      >
        <ui.Flex
          direction="row"
          justifyContent="center"
          alignItems="end"
          gap="size-100"
          wrap
        >
          <PalSelect
            label="Parent A:"
            selectedKey={parent1}
            onInputChange={v => {
              if (!v) {
                setParent1('')
              }
            }}
            onSelectionChange={key => {
              setParent1(key)
            }}
          />
          {/* <Add /> */}
          <PalSelect
            label="Parent B:"
            selectedKey={parent2}
            onInputChange={v => {
              if (!v) {
                setParent2('')
              }
            }}
            onSelectionChange={key => {
              setParent2(key)
            }}
          />
          {/* <ChevronRight /> */}
          <PalSelect
            label="Child:"
            selectedKey={child}
            onSelectionChange={key => {
              console.info('child', key)
              // TODO: add free combo option
              if (parent1 && parent2) {
                setParent2('')
              }
              // setParent1('')
              // setParent2('')
              setChild(key)
            }}
          />
          <ui.ButtonGroup>
            <ui.Button type="reset" variant="secondary">
              Reset
            </ui.Button>
          </ui.ButtonGroup>
        </ui.Flex>
      </ui.Form>
      <ui.View margin="size-100">
        <FlowGraph text={graph} />
      </ui.View>
    </ui.View>
  )
}

export default PathwayFinder
