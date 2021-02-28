import { IssueChat } from 'src/services/websockets/stream/IssueChat'

export class WsController {
  constructor () {
    this.streamMapping = {
      issue_chat: IssueChat
    }
  }

  processEvent (event) {
    const data = JSON.parse(event.data)
    const stream = data.stream
    const payload = data.payload

    const Controller = this.streamMapping[stream]
    if (!Controller) {
      throw Error('Undefined stream handler.')
    }

    Controller(payload)
  }
}
