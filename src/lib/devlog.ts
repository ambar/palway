const createNoop = () => () => {}

const colors = [
  'lightcoral',
  'lightcyan',
  'lightgreen',
  'lightpink',
  'lightsalmon',
  'lightseagreen',
  'lightskyblue',
  'lightsteelblue',
  'lightyellow',
]
let index = 0
const nextColor = () => colors[index++ % colors.length]

/**
 * To log messages in development mode.
 */
function createDevlog(type) {
  return console.log.bind(console, `%c${type}`, `color: ${nextColor()}`)
}

export default process.env.NODE_ENV === 'development'
  ? createDevlog
  : createNoop
