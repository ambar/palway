import getPalIcon from '../getPalIcon'
import type {PalName} from '../palNames'
import {normalPalsByName} from '../pals'
import {styleMap, styleToAttr} from './shared'
import type {RankDir} from './dot'

type Options = {
  preset?: 'noImage' | 'image'
  direction?: RankDir
}

/**
 * Create a combo graph of all possible matches for a given child
 * @see https://graphviz.org/docs/graph/
 */
export const makeComboGraph = (
  parents: [PalName, PalName][],
  child: PalName,
  i18n: (key: string) => string,
  {preset = 'image', direction = 'LR'}: Options = {},
) => {
  const style = styleMap[preset]
  const attr = (palName: PalName) => {
    return [
      preset === 'image' &&
        `image="${getPalIcon(normalPalsByName[palName].pal_dev_name)}"`,
      `label="${name(palName)}"`,
    ]
      .filter(Boolean)
      .join(',')
  }
  const name = (palName: PalName) => {
    const pal = normalPalsByName[palName]
    return i18n(`palName_${pal.pal_dev_name}`)
  }
  if (!parents?.length) {
    return ''
  }
  // label="Palway"
  // labelloc=r
  // labeljust=r
  // fontsize=12
  // fontname="Helvetica,Arial,sans-serif"
  return String.raw`
digraph Palway {
  node [fontname="Helvetica,Arial,sans-serif",style=dashed]
  edge [fontname="Helvetica,Arial,sans-serif",style=dashed,arrowsize=.9,arrowhead=empty]
  rankdir=${direction}
  node [${styleToAttr(style)}];
  root [${attr(child)},class="root"]

  ${parents
    .map((parent, i) => {
      const na = parent[0].replace(/ /g, '_')
      const nb = parent[1].replace(/ /g, '_')
      const connect = `${na}_${nb}_${i}`
      const a = `${na}_node_a_${i}`
      const b = `${nb}_node_b_${i}`
      return String.raw`
  ${connect}[shape=circle,style=filled,label="",width=.05, height=.05]
  ${connect} -> root []
  ${a} -> ${connect} [dir=none]
  ${b} -> ${connect} [dir=none]
  ${a} [${attr(parent[0])}]
  ${b} [${attr(parent[1])}]
`
    })
    .join('\n')}
}
`
}
