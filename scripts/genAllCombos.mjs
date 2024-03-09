import fs from 'node:fs/promises'
import stringify from 'json-stringify-pretty-compact'
import {getAllCombosMap} from '../src/lib/combos'

console.time('getAllCombosMap')
const map = getAllCombosMap(true)
console.timeEnd('getAllCombosMap')

const results = []
for (const [a, bMap] of map) {
  for (const [b, c] of bMap) {
    results.push([a, b, c])
  }
}
await fs.writeFile('src/data/combos.json', stringify(results))
