import {Button, Provider, defaultTheme} from '@adobe/react-spectrum'
import './App.css'

function App() {
  return (
    <Provider theme={defaultTheme}>
      <Button variant="accent" onPress={() => alert('Hey there!')}>
        Hello React Spectrum!
      </Button>
    </Provider>
  )
}

export default App
