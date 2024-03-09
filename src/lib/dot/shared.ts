import type {Shape} from './dot'

type Style = {
  shape: Shape
  width?: number
  height?: number
  labelloc?: 'b' | 'c' | 't'
}

export const styleMap: Record<'noImage' | 'image', Style> = {
  noImage: {shape: 'none'},
  image: {shape: 'egg', height: 1.5, width: 1.5, labelloc: 'b'},
}

export const styleToAttr = (style: Style) =>
  Object.entries(style)
    .map(([k, v]) => `${k}=${v}`)
    .join(',')
