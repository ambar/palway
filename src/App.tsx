import {Provider, defaultTheme} from '@adobe/react-spectrum'
import {NoSSR, useLang, useDark} from 'rspress/runtime'
import PathwayFinder from './PathwayFinder'
import './index.css'
import {HistoryProvider} from './lib/params'

function App() {
  const dark = useDark()
  const lang = useLang()
  // TODO: react-spectrum FOUC
  // TODO: rspress dark true->false->true
  return (
    <Provider
      // Can't use Provider in theme/index.tsx, will cause [Suspense boundary warning](https://react.dev/errors/421?invariant=421) in production mode
      locale={lang}
      colorScheme={dark ? 'dark' : 'light'}
      // The defaultTheme uses the Spectrum light and darkest color themes
      // The darkTheme uses the Spectrum dark and darkest color themes
      // The lightTheme uses the Spectrum lightest and darkest color themes
      // https://github.com/adobe/react-spectrum/tree/main/packages/%40adobe/spectrum-css-temp/vars
      theme={defaultTheme}
      // https://react-spectrum.adobe.com/react-spectrum/theming.html#platform-scale
      scale="large"
    >
      <HistoryProvider>
        <NoSSR>
          <PathwayFinder />
        </NoSSR>
      </HistoryProvider>
    </Provider>
  )
}

export default App
