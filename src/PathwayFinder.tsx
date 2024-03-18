import * as ui from '@adobe/react-spectrum'
import NoSearchResults from '@spectrum-icons/illustrations/NoSearchResults'
// import More from '@spectrum-icons/workflow/More'
// import {motion, AnimatePresence} from 'framer-motion'
import {useEffect, useState} from 'react'
import DotGraph from './DotGraph'
import {PalSelect} from './PalSelect'
import {type PalPair, findReverseParents, getCombo} from './lib/combos'
import devlog from './lib/devlog'
import {makeComboGraph} from './lib/dot/comboGraph'
import {makeTreeGraph} from './lib/dot/treeGraph'
import {type PalName, palNameSet} from './lib/palNames'
import {useBooleanParam, useEnumParam} from './lib/params'
import {type PalNode, type PalTree, createTree} from './lib/search'
import useI18n from './lib/useI18n'
import {usePreserveSearchParams} from './lib/tmp'

type Range = {
  start: number
  end: number
}

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
      layers: Record<number, PalNode[]>
      range: Range
      layerRanges: {count: number; layer: number; range: Range}[]
    }

type StyleKey = 'Image' | 'Vertical'

const defaultRange = {start: 1, end: 5}
const log = devlog('PathwayFinder')

/**
 * Breeding Pathway Finder
 */
const PathwayFinder = () => {
  usePreserveSearchParams()
  const t = useI18n()
  const [parent1, setParent1] = useEnumParam<PalName>('parent1', palNameSet)
  const [parent2, setParent2] = useEnumParam<PalName>('parent2', palNameSet)
  const [child, setChild] = useEnumParam<PalName>('child', palNameSet)
  const [graph, setGraph] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  // const [styleKeys, setStyleKeys] = useState(
  //   () => new Set<StyleKey>(['Image', 'Vertical']),
  // )
  const [layeredFilter, setLayeredFilter] = useBooleanParam('layer', true)
  const [withImage, setWithImage] = useBooleanParam('image', true)
  const [isVertical, setIsVertical] = useBooleanParam('vertical', true)

  useEffect(() => {
    if (parent1 && parent2) {
      const itsChild = getCombo(parent1, parent2)
      if (!itsChild) {
        setChild(null)
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
      const nodes: PalNode[] = []
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
      const layers = Object.groupBy(nodes, x => x.depth) as Record<
        number,
        PalNode[]
      >
      setResult({
        type: 'tree',
        nodes,
        tree,
        parent,
        child,
        range: defaultRange,
        layers,
        layerRanges: Object.entries(layers).map(([n, x], i) => ({
          count: x.length,
          layer: Number(n),
          range: {start: 0, end: i === 0 ? 2 : 1},
        })),
      })
      return
    }

    setResult(null)
  }, [parent1, parent2, child, setChild])

  useEffect(() => {
    if (!result) {
      setGraph(null)
      return
    }
    if (result.type === 'combo') {
      setGraph(
        makeComboGraph(result.combos, result.child, t, {
          // preset: styleKeys.has('Image') ? 'image' : 'noImage',
          // direction: styleKeys.has('Vertical') ? 'BT' : 'LR',
        }),
      )
    } else if (result.type === 'tree') {
      const {nodes, range, tree, parent, child} = result
      console.time('makeTreeGraph')
      const sliced = !layeredFilter
        ? nodes.slice(range.start - 1, range.end)
        : result.layerRanges.flatMap(x => {
            const range = x.range
            const layer = result.layers[x.layer]
            return layer.slice(Math.max(0, range.start - 1), range.end)
          })
      const treeGraph = makeTreeGraph(sliced, tree.root, parent, child, t, {
        preset: withImage ? 'image' : 'noImage',
        direction: isVertical ? 'BT' : 'LR',
      })
      console.timeEnd('makeTreeGraph')
      log(tree, {nodes, range}, sliced)
      setGraph(treeGraph)
    }
  }, [result, layeredFilter, withImage, isVertical, t])

  // const styleMenu = (
  //   <ui.MenuTrigger>
  //     <ui.ActionButton isQuiet marginStart="size-100">
  //       <More />
  //     </ui.ActionButton>
  //     <ui.Menu
  //       selectionMode="multiple"
  //       selectedKeys={styleKeys}
  //       onSelectionChange={setStyleKeys}
  //     >
  //       <ui.Section title={t('styles')}>
  //         <ui.Item key="Image">{t('image')}</ui.Item>
  //         {result?.type === 'tree' && (
  //           <ui.Item key="Vertical">{t('vertical')}</ui.Item>
  //         )}
  //       </ui.Section>
  //     </ui.Menu>
  //   </ui.MenuTrigger>
  // )

  let searchResult: React.ReactNode = null
  if (result?.type === 'combo') {
    // noop
  } else if (result?.type === 'tree') {
    const isEmpty = result.nodes.length === 0
    if (isEmpty) {
      searchResult = (
        <ui.IllustratedMessage marginTop="5em">
          <NoSearchResults />
          <ui.Heading>{t('no-matching-results')}</ui.Heading>
          <ui.Content>{t('try-another-search')}</ui.Content>
        </ui.IllustratedMessage>
      )
    } else if (result.nodes.length > 0) {
      searchResult = (
        <ui.Flex
          maxWidth={1000}
          margin="1em auto"
          direction="column"
          gap=".5em"
        >
          <ui.Flex justifyContent="center" wrap="wrap" columnGap=".1em">
            {/* <ui.RadioGroup
              label={t('range')}
              orientation="horizontal"
              labelPosition="side"
              value={rangeType}
              onChange={value => setRangeType(value as typeof rangeType)}
            >
              <ui.Radio value="Layer">{t('layer')}</ui.Radio>
              <ui.Radio value="All">{t('all')}</ui.Radio>
            </ui.RadioGroup> */}

            <ui.Switch isSelected={layeredFilter} onChange={setLayeredFilter}>
              {t('layer')}
            </ui.Switch>

            <ui.Switch isSelected={withImage} onChange={setWithImage}>
              {t('image')}
            </ui.Switch>

            <ui.Switch isSelected={isVertical} onChange={setIsVertical}>
              {t('vertical')}
            </ui.Switch>
          </ui.Flex>

          <ui.Flex justifyContent="center" wrap>
            {layeredFilter &&
              result.layerRanges.map((x, i) => (
                <ui.RangeSlider
                  key={x.layer}
                  marginX="auto"
                  margin="0 1em"
                  label={`${t('layer')} ${x.layer} (${x.count})`}
                  value={x.range}
                  maxValue={x.count}
                  onChange={range => {
                    setResult({
                      ...result,
                      layerRanges: result.layerRanges.map((y, j) =>
                        i === j ? {...x, range} : y,
                      ),
                    })
                  }}
                />
              ))}
          </ui.Flex>

          {!layeredFilter && (
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
        </ui.Flex>
      )
    }
  }

  return (
    <ui.View>
      <ui.Form
        validationBehavior="native"
        onReset={() => {
          setParent1(null)
          setParent2(null)
          setChild(null)
          setGraph(null)
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
            label={`${t('parent')} 1`}
            selectedKey={parent1}
            onInputChange={v => {
              if (!v) {
                setParent1(null)
              }
            }}
            onSelectionChange={key => {
              setParent1(key)
            }}
          />
          <PalSelect
            label={`${t('parent')} 2`}
            selectedKey={parent2}
            onInputChange={v => {
              if (!v) {
                setParent2(null)
              }
            }}
            onSelectionChange={key => {
              setParent2(key)
            }}
          />
          <PalSelect
            label={t('child')}
            selectedKey={child}
            onSelectionChange={key => {
              if (parent1 && parent2) {
                setParent2(null)
              }
              setChild(key)
            }}
          />
          <ui.ButtonGroup>
            <ui.Button type="reset" variant="secondary">
              {t('reset')}
            </ui.Button>
            {/* {styleMenu} */}
          </ui.ButtonGroup>
        </ui.Flex>
        {searchResult}
        <ui.View padding="1em">
          <DotGraph text={graph} />
        </ui.View>
        {/* <AnimatePresence mode="wait">
          {searchResult && (
            <motion.div
              key={noResult ? 'noResult' : 'result'}
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{
                duration: 0.1,
              }}
              style={{
                width: '100%',
              }}
            >
            </motion.div>
          )}
        </AnimatePresence> */}
      </ui.Form>
    </ui.View>
  )
}

export default PathwayFinder
