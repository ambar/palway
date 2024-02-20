import palIcons, {type PalDevName} from '../assets/images/pal_icons_200w'

const getPalIcon = (devName: string) => {
  return palIcons[devName as PalDevName]
}

export default getPalIcon
