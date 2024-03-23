import {Provider, defaultTheme} from '@adobe/react-spectrum'
import {useDark} from 'rspress/runtime'
import Theme from 'rspress/theme'
import './index.css'

const Layout = () => {
  const dark = useDark()
  return (
    <Provider
      colorScheme={dark ? 'dark' : 'light'}
      theme={defaultTheme}
      // The defaultTheme uses the Spectrum light and darkest color themes
      // The darkTheme uses the Spectrum dark and darkest color themes
      // The lightTheme uses the Spectrum lightest and darkest color themes
      // https://github.com/adobe/react-spectrum/tree/main/packages/%40adobe/spectrum-css-temp/vars
      // https://react-spectrum.adobe.com/react-spectrum/theming.html#platform-scale
      scale="large"
      id="app"
    >
      <Theme.Layout />
    </Provider>
  )
}

// https://rspress.dev/guide/advanced/custom-theme.html
export default {
  ...Theme,
  Layout,
}

export * from 'rspress/theme'
