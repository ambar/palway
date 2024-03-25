import {Provider, defaultTheme} from '@adobe/react-spectrum'
import {useLang, useDark} from 'rspress/runtime'
import PathwayFinder from './PathwayFinder'
import './index.css'
import {HistoryProvider} from './lib/params'

// The defaultTheme uses the Spectrum light and darkest color themes
// The darkTheme uses the Spectrum dark and darkest color themes
// The lightTheme uses the Spectrum lightest and darkest color themes
// https://github.com/adobe/react-spectrum/tree/main/packages/%40adobe/spectrum-css-temp/vars
const ssrStyleFix = `{
  let root = document.getElementById('app')
  let rootClass = root.classList
  let rootStyle = root.style
  let darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
  let storeKey = 'rspress-theme-appearance'
  let storeValue = localStorage[storeKey]
  let isDark = storeValue === 'dark' || (!storeValue && darkQuery.matches)
  rootClass.toggle("${defaultTheme.light['spectrum--light']}", !isDark)
  rootClass.toggle("${defaultTheme.dark['spectrum--darkest']}", isDark)
  rootStyle.colorScheme = isDark ? 'dark' : 'light'
}`.replace(/\n/g, ';')

function App() {
  const dark = useDark()
  const lang = useLang()
  // TODO: rspress dark true->false->true
  return (
    <Provider
      // Can't use Provider in theme/index.tsx, will cause [Suspense boundary warning](https://react.dev/errors/421?invariant=421) in production mode
      locale={lang}
      colorScheme={dark ? 'dark' : 'light'}
      theme={defaultTheme}
      // https://react-spectrum.adobe.com/react-spectrum/theming.html#platform-scale
      scale="large"
      id="app"
    >
      <script dangerouslySetInnerHTML={{__html: ssrStyleFix}} />
      <HistoryProvider>
        <PathwayFinder />
      </HistoryProvider>
    </Provider>
  )
}

export default App
