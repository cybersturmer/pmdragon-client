import { LocalStorage } from 'quasar'
import { DEBUG, DEBUG_ENV, PROD_ENV } from 'src/.env'

function getDefaultEnv () {
  return DEBUG ? DEBUG_ENV : PROD_ENV
}

export default function () {
  return {
    host: LocalStorage.getItem('connection.host') || getDefaultEnv()
  }
}
