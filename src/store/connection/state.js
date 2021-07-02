import { LocalStorage } from 'quasar'
import { empty, restored } from './presets'

export default function () {
	return LocalStorage.getItem('connection.enabled') ? restored() : empty()
}
