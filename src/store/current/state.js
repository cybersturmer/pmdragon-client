import { LocalStorage } from 'quasar'
import { empty, restored } from './presets'

export default function () {
	return LocalStorage.getItem('current.enabled') ? restored() : empty()
}
