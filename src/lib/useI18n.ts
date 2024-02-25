import {useI18n} from 'rspress/runtime'
import type config from '../../i18n.json'

type Config = typeof config
export default useI18n<Config>
