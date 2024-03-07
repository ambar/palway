import {expect, test} from 'vitest'
import {createTree, walk} from '../search'

// 35 -> 16
test('Penking -> Rooby', () => {
  const tree = makeTree('Rooby', 'Penking')
  expect(tree.root.name).toBe('Rooby')
  expect(tree.root.parents.length).toBe(37)
  expect(tree.layers.length).toBe(4)
  const pairs = tree.layers.reduce((acc, layer) => acc + layer.length, 0)
  expect(pairs).toBe(9609)
  const layerNodes = tree.layers.reduce(
    (acc, layer) =>
      acc + layer.reduce((acc, x) => acc + Array.from(x).length, 0),
    0,
  )
  expect(layerNodes).toBe(19218)

  expect(getCounts(tree)).toMatchInlineSnapshot(`
    {
      "layer": 4,
      "match": 139,
      "node": 19219,
      "pair": 9609,
    }
  `)
})

test('Jetragon -> Lamball', () => {
  const tree = makeTree('Lamball', 'Jetragon')
  expect(getCounts(tree)).toMatchInlineSnapshot(`
    {
      "layer": 7,
      "match": 170,
      "node": 23173,
      "pair": 11586,
    }
  `)
})

test('Caprity -> Teafant', () => {
  const tree = makeTree('Teafant', 'Caprity')
  expect(getCounts(tree)).toMatchInlineSnapshot(`
    {
      "layer": 8,
      "match": 144,
      "node": 19905,
      "pair": 9952,
    }
  `)
})

const makeTree = (root, parent) => {
  return createTree(root, {
    create(node) {
      node.match = node.name === parent
    },
    visitOnce(node) {
      if (node.mate?.name === root) {
        return {break: true, unvisited: true}
      }
    },
  })
}

const getCounts = tree => {
  const counts = {
    node: 0,
    pair: 0,
    layer: 0,
    match: 0,
  }
  walk(tree, {
    node(node) {
      counts.node += 1
      if (node.match) {
        counts.match += 1
      }
    },
    pair() {
      counts.pair += 1
    },
    layer() {
      counts.layer += 1
    },
  })
  return counts
}
