import { LocalStorage } from 'quasar'
import { DEBUG_ENV, PROD_ENV } from 'src/.env'

function getDefaultEnv () {
  return process.env.DEV ? DEBUG_ENV : PROD_ENV
}

export default function () {
  return {
    host: LocalStorage.getItem('connection.host') || getDefaultEnv(),
    socket: {
      connected: false,
      reconnectError: false,
      message: ''
    }
  }
}
