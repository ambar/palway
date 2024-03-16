import {expect, test} from 'vitest'
import {createTree} from '../../search'
import {makeTreeGraph} from '../treeGraph'

const makeTreeResult = (root, parent) => {
  const nodes = []
  const tree = createTree(root, {
    create(node) {
      if (node.name === parent) {
        node.match = true
        nodes.push(node)
      }
    },
    visitOnce(node) {
      if (node.mate?.name === root) {
        return {break: true, unvisited: true}
      }
    },
  })
  return {tree, nodes}
}

test('makeTreeGraph', () => {
  const parent = 'Jetragon'
  const child = 'Lamball'
  const {tree, nodes} = makeTreeResult(child, parent)
  expect(
    makeTreeGraph(nodes.slice(0, 1), tree.root, parent, child, v => v),
  ).toMatchSnapshot()
})
