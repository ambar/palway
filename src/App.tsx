import {Provider, defaultTheme} from '@adobe/react-spectrum'
import {NoSSR, useDark} from 'rspress/runtime'
import PathwayFinder from './PathwayFinder'
import './index.css'
import {HistoryProvider} from './lib/params'

function App() {
  const dark = useDark()
  return (
    <Provider
      colorScheme={dark ? 'dark' : 'light'}
      theme={defaultTheme}
      // https://react-spectrum.adobe.com/react-spectrum/theming.html#platform-scale
      scale="large"
      id="app"
      UNSAFE_style={{
        // override for rspress
        '--spectrum-alias-background-color-default': dark ? 'black' : 'white',
      }}
    >
      <HistoryProvider>
        {/* TODO: react-spectrum FOUC; rspress dark true->false->true */}
        <NoSSR>
          <PathwayFinder />
        </NoSSR>
      </HistoryProvider>
    </Provider>
  )
}

export default App
