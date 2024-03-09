import getPalIcon from '../getPalIcon'
import type {PalName} from '../palNames'
import {normalPalsByName} from '../pals'
import type {PalNode, PalNodePair} from '../search'
import unfold from '../unfold'

/**
 * Create a text graph of the matched nodes
 * @see https://graphviz.org/docs/graph/
 */
export const makeTreeGraph = (
  nodes: PalNode[],
  root: PalNode,
  parent: PalName,
  child: PalName,
  i18n: (key: string) => string,
) => {
  const results: string[] = []
  const visited = new Set<PalNode>()
  const attr = (node: PalNode) => {
    const palName = node.name
    const src = getPalIcon(normalPalsByName[palName].pal_dev_name)
    return [
      // 'fixedsize=true',
      `image="${src}"`,
      'labelloc=b',
      `label="${name(palName)}"`,
      palName === parent ? 'class=from' : '',
      // distinguish between root and descendant with child name
      node === root ? 'class=root' : '',
      node !== root && palName === child ? 'class=warn' : '',
    ]
      .filter(Boolean)
      .join(',')
  }
  const name = (palName: PalName) => {
    const pal = normalPalsByName[palName]
    return i18n(`palName_${pal.pal_dev_name}`)
  }
  let idCounter = 0
  const nextId = () => `i${idCounter++}`
  const definedSet = new Set<PalNode | PalNodePair>()
  const idMap = new Map<PalNode | PalNodePair, string>()
  // TODO: add id to tree
  const getID = (node: PalNode | PalNodePair) => {
    if (idMap.has(node)) {
      return idMap.get(node)
    }
    const id = nextId()
    idMap.set(node, id)
    return id
  }
  const defineNode = (node: PalNode) => {
    if (!node) {
      return
    }
    if (definedSet.has(node)) {
      return
    }
    const id = getID(node)
    definedSet.add(node)
    return `${id} [${attr(node)}]`
  }

  const definePair = (pair: PalNodePair) => {
    if (definedSet.has(pair)) {
      return
    }
    definedSet.add(pair)
    const l = getID(pair.left)
    const r = getID(pair.right)
    const pid = getID(pair)
    const cid = getID(pair.left.child)
    return [
      `${pid}[shape=circle,style=filled,label="",width=.05,height=.05]`,
      `${pid} -> ${cid}`,
      defineNode(pair.left.child),
      defineNode(pair.left),
      defineNode(pair.right),
      `${l} -> ${pid} [dir=none]`,
      `${r} -> ${pid} [dir=none]`,
    ]
      .filter(Boolean)
      .join('\n')
  }
  for (const node of nodes) {
    if (visited.has(node)) {
      continue
    }
    visited.add(node)
    const path = unfold(node, x => x.child)
    for (const node of path) {
      if (node.pair) {
        const r = definePair(node.pair)
        if (r) {
          results.push(r)
        }
      }
    }
  }
  return String.raw`
digraph Palway {
  node [fontname="Helvetica,Arial,sans-serif",style=dashed]
  edge [fontname="Helvetica,Arial,sans-serif",style=dashed,arrowsize=.9,arrowhead=empty]
  rankdir=BT
  node [shape=egg,width=1.5,height=1.5]
 ${results.join('\n')}
}`
}
