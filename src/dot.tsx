import type {Viz} from '@viz-js/viz'
import {useEffect, useRef} from 'react'
import {normalPalsByName} from './lib/pals'
import getPalIcon from './lib/getPalIcon'
import once from './lib/once'
import type {PalName} from './lib/palNames'
import './dot.css'

let viz: Viz
export const init = async () => {
  // HMR
  if (viz) {
    return viz
  }
  console.time('vis:init')
  viz = (await import('@viz-js/viz')).instance()
  console.timeEnd('vis:init')
  return viz
}

// https://graphviz.org/docs/graph/
export const makeGraph = (
  parents: [PalName, PalName][],
  child: PalName,
  i18n,
) => {
  const attr = (palName: PalName) => {
    const src = getPalIcon(normalPalsByName[palName].pal_dev_name)
    return String.raw`image="${src}", labelloc=b, label="${name(palName)}"`
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
  rankdir=LR;
  node [shape=egg,width=1.5, height=1.5];
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
  ${connect} -> root [] ;
  ${a} -> ${connect} [dir=none,] ;
  ${b} -> ${connect} [dir=none,] ;
  ${a} [${attr(parent[0])}]
  ${b} [${attr(parent[1])}]
`
    })
    .join('\n')}
}
`
}

const getImages = once(() => {
  return Object.values(normalPalsByName).map(pal => {
    return {
      name: getPalIcon(pal.pal_dev_name),
      width: 40,
      height: 40,
    }
  })
})

export const FlowGraph = ({text}: {text: string}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    void (async () => {
      if (!ref.current) {
        return
      }
      const viz = await init()
      if (!text) {
        ref.current.textContent = ''
        return
      }

      console.time('viz:render')
      const svg = viz.renderSVGElement(text, {
        images: getImages(),
      })
      console.timeEnd('viz:render')
      // keep the top of the svg at the top of the container for mobile devices
      svg.setAttribute('preserveAspectRatio', 'xMaxYMin')
      ref.current.textContent = ''
      ref.current.append(svg)
    })()

    return () => {
      if (ref.current) {
        ref.current.textContent = ''
      }
    }
  }, [text])

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    />
  )
}
