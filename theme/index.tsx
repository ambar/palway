import Theme from 'rspress/theme'
import './index.css'

const Layout = () => {
  return <Theme.Layout />
}

// https://rspress.dev/guide/advanced/custom-theme.html
export default {
  ...Theme,
  Layout,
}

export * from 'rspress/theme'
