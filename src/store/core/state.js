import { LocalStorage } from 'quasar'
import { empty, restored } from './presets'

export default function () {
	return LocalStorage.getItem('core.enabled') ? restored() : empty()
}
