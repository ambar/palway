import {NoSSR} from 'rspress/runtime'
import PathwayFinder from './PathwayFinder'
import './index.css'
import {HistoryProvider} from './lib/params'

function App() {
  return (
    <HistoryProvider>
      {/* TODO: react-spectrum FOUC; rspress dark true->false->true */}
      <NoSSR>
        <PathwayFinder />
      </NoSSR>
    </HistoryProvider>
  )
}

export default App
