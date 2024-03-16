import {useEffect, useRef} from 'react'
import './DotGraph.css'
import getPalIcon from './lib/getPalIcon'
import once from './lib/once'
import {normalPalsByName} from './lib/pals'

export const init = once(async () => {
  console.time('vis:init')
  const viz = (await import('@viz-js/viz')).instance()
  console.timeEnd('vis:init')
  return viz
})

// https://graphviz.org/docs/layouts/
type Engine =
  | 'circo'
  | 'dot'
  | 'fdp'
  | 'sfdp'
  | 'neato'
  | 'nop'
  | 'nop1'
  | 'nop2'
  | 'osage'
  | 'patchwork'
  | 'twopi'

const getImages = once(() => {
  return Object.values(normalPalsByName).map(pal => {
    return {
      name: getPalIcon(pal.pal_dev_name),
      width: 45,
      height: 45,
    }
  })
})

const DotGraph = ({text}: {text: string | null}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) {
      return
    }
    let unmounted = false
    void (async () => {
      const viz = await init()
      if (unmounted) {
        return
      }
      if (!text) {
        ref.current.textContent = ''
        return
      }
      console.time('viz:render')
      // prefer dot, neato, fdp, twopi
      const engine: Engine = 'dot'
      const svg = viz.renderSVGElement(text, {
        engine,
        images: getImages(),
      })
      console.timeEnd('viz:render')
      // keep the top of the svg at the top of the container for mobile devices
      svg.setAttribute('preserveAspectRatio', 'xMaxYMin')
      ref.current.textContent = ''
      ref.current.append(svg)
    })()

    return () => {
      unmounted = true
      if (ref.current) {
        ref.current.textContent = ''
      }
    }
  }, [text])

  return (
    <div
      ref={ref}
      className="viz"
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    />
  )
}

export default DotGraph
