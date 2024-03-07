import {expect, test} from 'vitest'
import {createTree, walk} from '../search'

test('createTree', () => {
  const tree = createTree('Rooby', node => {
    node.match = node.name === 'Penking'
  })
  expect(tree.root.name).toBe('Rooby')
  expect(tree.root.parents.length).toBe(37)
  expect(tree.layers.length).toBe(4)
  const pairs = tree.layers.reduce((acc, layer) => acc + layer.length, 0)
  expect(pairs).toBe(9344)
  const layerNodes = tree.layers.reduce(
    (acc, layer) =>
      acc + layer.reduce((acc, x) => acc + Array.from(x).length, 0),
    0,
  )
  expect(layerNodes).toBe(18688)

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
  expect(counts).toMatchInlineSnapshot(`
    {
      "layer": 4,
      "match": 134,
      "node": 18689,
      "pair": 9344,
    }
  `)
})
