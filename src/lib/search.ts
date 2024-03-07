import {combosMapByChildName} from './combos'
import {type PalName} from './palNames'

export type PalNode = {
  name: PalName
  match?: boolean
  child?: PalNode
  pair?: PalNodePair
  parents: PalNodePair[]
}

export type PalNodePair = {
  [Symbol.iterator](): Generator<PalNode>
  left: PalNode
  right: PalNode
}

type LayerNodes = PalNodePair[]

export type PalTree = ReturnType<typeof createTree>

/**
 * - Create a tree of all possible parents for a given child
 * - The tree is a directed graph, the root is the child
 */
export const createTree = (
  rootName: PalName,
  callback?: (node: PalNode) => void,
) => {
  // prevent infinite loops
  const visited = new Set<PalName>()
  const makeNode = (name: PalName) => {
    const node: PalNode = {name, parents: []}
    callback?.(node)
    return node
  }
  const makeParents = (node: PalNode): PalNodePair[] => {
    return (combosMapByChildName.get(node.name) ?? []).map(([a, b]) => {
      const left = makeNode(a)
      const right = makeNode(b)
      left.child = node
      right.child = node
      const pair = {
        left,
        right,
        *[Symbol.iterator]() {
          yield left
          yield right
        },
      }
      left.pair = pair
      right.pair = pair
      return pair
    })
  }
  const layers: LayerNodes[] = []
  const root = makeNode(rootName)
  while (true) {
    const layer = layers[layers.length - 1]
    const neighbors: PalNodePair[] = []
    const visit = (node: PalNode) => {
      if (!visited.has(node.name)) {
        visited.add(node.name)
        // FIXME: filter all neighbors in the same layer
        if (node.match) {
          return
        }
        node.parents = makeParents(node)
        neighbors.push(...node.parents)
      }
    }
    if (!layer) {
      visit(root)
    } else {
      for (const pair of layer) {
        for (const node of pair) {
          visit(node)
        }
      }
    }
    if (!neighbors.length) {
      break
    }
    layers.push(neighbors)
  }
  return {root, layers}
}

type Visitor = {
  node?: (node: PalNode) => void
  pair?: (pair: PalNodePair) => void
  layer?: (layer: PalNodePair[]) => void
}

export const walk = (tree: PalTree, callback: Visitor) => {
  callback.node?.(tree.root)
  for (const layer of tree.layers) {
    callback.layer?.(layer)
    for (const pair of layer) {
      callback.pair?.(pair)
      for (const node of pair) {
        callback.node?.(node)
      }
    }
  }
}
