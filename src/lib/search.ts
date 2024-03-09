import {combosMapByChildName} from './combos'
import type {PalName} from './palNames'

export type PalNode = {
  name: PalName
  depth: number
  match?: boolean
  child?: PalNode
  pair?: PalNodePair
  mate?: PalNode
  parents: PalNodePair[]
}

export type PalNodePair = {
  [Symbol.iterator](): Generator<PalNode>
  left: PalNode
  right: PalNode
}

type LayerNodes = PalNodePair[]

export type PalTree = ReturnType<typeof createTree>

type CreateTreeVisitor = {
  create?(node: PalNode): void
  visitOnce?(node: PalNode): null | {
    /** @default false */
    skip?: boolean
    /** @default true */
    unvisited?: boolean
  }
}

/**
 * - Create a tree of all possible parents for a given child
 * - The tree is a directed graph, the root is the child
 */
export const createTree = (
  rootName: PalName,
  visitor: CreateTreeVisitor = {},
) => {
  // prevent infinite loops
  const visited = new Set<PalName>()
  const makeNode = (name: PalName, depth: number) => {
    const node: PalNode = {name, depth, parents: []}
    visitor.create?.(node)
    return node
  }
  const makeParents = (node: PalNode, depth: number): PalNodePair[] => {
    return (combosMapByChildName.get(node.name) ?? []).map(([a, b]) => {
      const left = makeNode(a, depth)
      const right = makeNode(b, depth)
      left.child = node
      right.child = node
      left.mate = right
      right.mate = left
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
  const root = makeNode(rootName, 0)
  while (true) {
    const layer = layers[layers.length - 1]
    const neighbors: PalNodePair[] = []
    const visit = (node: PalNode) => {
      if (!visited.has(node.name)) {
        const r = visitor.visitOnce?.(node) || {}
        if (!r.unvisited) {
          visited.add(node.name)
        }
        if (r.skip || node.match) {
          return
        }
        node.parents = makeParents(node, layers.length + 1)
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
