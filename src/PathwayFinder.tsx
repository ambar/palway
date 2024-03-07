// https://spectrum.adobe.com/page/icons/
import * as ui from '@adobe/react-spectrum'
import {useEffect, useState} from 'react'
import {PalSelect} from './PalSelect'
import DotGraph from './DotGraph'
import {makeComboGraph} from './lib/dot/comboGraph'
import {makeTreeGraph} from './lib/dot/treeGraph'
import {findReverseParents, getCombo} from './lib/combos'
import {PalName} from './lib/palNames'
import useI18n from './lib/useI18n'
import {createTree} from './lib/search'

type SelectedKey = PalName

/**
 * Breading calculator for Palworld
 */
const PathwayFinder = () => {
  const t = useI18n()
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
      setGraph(makeComboGraph([[parent1, parent2]], childName, t))
      return
    }

    if (child && !parent1 && !parent2) {
      const parents = findReverseParents(child)
      setGraph(makeComboGraph(parents, child, t))
      return
    }

    const parent = parent1 || parent2
    if (child && parent) {
      console.time('treeSearch')
      const nodes = []
      const tree = createTree(child, node => {
        if (node.name === parent) {
          nodes.push(node)
          node.match = true
        }
      })
      console.timeEnd('treeSearch')
      console.time('makeTreeGraph')
      const treeGraph = makeTreeGraph(nodes, t, parent, child)
      console.timeEnd('makeTreeGraph')
      console.info(tree)
      setGraph(treeGraph)
      // const parents = findReverseParents(child, p => p.includes(parent))
      // setGraph(makeGraph(parents, child, t))
      return
    }
  }, [parent1, parent2, child, t])

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
            label={t('parent1')}
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
            label={t('parent2')}
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
            label={t('child')}
            selectedKey={child}
            onSelectionChange={key => {
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
              {t('reset')}
            </ui.Button>
          </ui.ButtonGroup>
        </ui.Flex>
      </ui.Form>
      <ui.View padding="1em">
        <DotGraph text={graph} />
      </ui.View>
    </ui.View>
  )
}

export default PathwayFinder
