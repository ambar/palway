import {Content, Provider, defaultTheme} from '@adobe/react-spectrum'
import {useDark} from 'rspress/runtime'
import PathwayFinder from './PathwayFinder'
import './index.css'

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
      <Content marginY="2em">
        <PathwayFinder />
      </Content>
    </Provider>
  )
}

export default App
