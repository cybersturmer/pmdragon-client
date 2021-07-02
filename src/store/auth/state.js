import { LocalStorage } from 'quasar'
import { empty, restored } from './presets'

export default function () {
	return LocalStorage.getItem('auth.enabled') ? restored() : empty()
}
