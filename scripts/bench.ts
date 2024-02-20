import {Bench} from 'tinybench'
import {getAllCombosMap} from '../src/lib/combos'
import combos from '../src/data/combos.json'

const bench = new Bench({time: 200})

bench.add('getAllCombosMap(true)', () => {
  getAllCombosMap(true)
})

await bench.warmup()
await bench.run()

console.table(bench.table())
