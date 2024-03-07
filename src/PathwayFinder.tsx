// https://spectrum.adobe.com/page/icons/
import * as ui from '@adobe/react-spectrum'
import {useEffect, useState} from 'react'
import DotGraph from './DotGraph'
import {PalSelect} from './PalSelect'
import {type PalPair, findReverseParents, getCombo} from './lib/combos'
import {makeComboGraph} from './lib/dot/comboGraph'
import {makeTreeGraph} from './lib/dot/treeGraph'
import {PalName} from './lib/palNames'
import {type PalNode, type PalTree, createTree} from './lib/search'
import devlog from './lib/devlog'
import useI18n from './lib/useI18n'

type Result =
  | {
      type: 'combo'
      combos: PalPair[]
      child: PalName
    }
  | {
      type: 'tree'
      nodes: PalNode[]
      tree: PalTree
      parent: PalName
      child: PalName
      range: {
        start: number
        end: number
      }
    }

const defaultRange = {start: 1, end: 5}
const log = devlog('PathwayFinder')

/**
 * Breading calculator for Palworld
 */
const PathwayFinder = () => {
  const t = useI18n()
  const [parent1, setParent1] = useState<PalName>()
  const [parent2, setParent2] = useState<PalName>()
  const [child, setChild] = useState<PalName>()
  const [graph, setGraph] = useState('')
  const [result, setResult] = useState<Result>(null)

  useEffect(() => {
    if (parent1 && parent2) {
      const itsChild = getCombo(parent1, parent2)
      if (!itsChild) {
        setChild(undefined)
        setResult(null)
        return
      }
      setChild(itsChild)
      setResult({type: 'combo', combos: [[parent1, parent2]], child: itsChild})
      return
    }

    if (child && !parent1 && !parent2) {
      const parents = findReverseParents(child)
      setResult({type: 'combo', combos: parents, child})
      return
    }

    const parent = parent1 || parent2
    if (child && parent) {
      // TODO: fix createTree for this case
      if (parent === child) {
        const parents = findReverseParents(child, p => p.includes(parent))
        setResult({type: 'combo', combos: parents, child})
        return
      }
      console.time('treeSearch')
      const nodes = []
      const tree = createTree(child, {
        create(node) {
          if (node.name === parent) {
            nodes.push(node)
            node.match = true
          }
        },
        visitOnce(node) {
          // strict match
          if (node.mate?.name === child) {
            return {skip: true, unvisited: true}
          }
        },
      })
      console.timeEnd('treeSearch')
      setResult({
        type: 'tree',
        nodes,
        tree,
        parent,
        child,
        range: defaultRange,
      })
      return
    }

    setResult(null)
  }, [parent1, parent2, child])

  useEffect(() => {
    if (!result) {
      setGraph(null)
      return
    }
    if (result.type === 'combo') {
      setGraph(makeComboGraph(result.combos, result.child, t))
    } else if (result.type === 'tree') {
      const {nodes, range, tree, parent, child} = result
      console.time('makeTreeGraph')
      const sliced = nodes.slice(range.start - 1, range.end)
      const treeGraph = makeTreeGraph(sliced, tree.root, parent, child, t)
      console.timeEnd('makeTreeGraph')
      log(tree, {nodes, range})
      setGraph(treeGraph)
    }
  }, [result, t])

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
        {result?.type === 'tree' && (
          <ui.RangeSlider
            marginX="auto"
            maxWidth={1000}
            width="100%"
            label={`${t('pathways')} (${result.nodes.length})`}
            value={result.range}
            minValue={1}
            maxValue={result.nodes.length}
            onChange={range => {
              setResult({...result, range})
            }}
          />
        )}
      </ui.Form>
      <ui.View padding="1em">
        <DotGraph text={graph} />
      </ui.View>
    </ui.View>
  )
}

export default PathwayFinder
