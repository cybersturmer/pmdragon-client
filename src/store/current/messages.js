import moment from 'moment'
import { removeElementById, unWatch, updateElementById } from 'src/services/util'
import { date } from 'quasar'

export default class MessagesPacker {
	constructor (persons, myPersonId) {
		this.persons = persons
		this.myPersonId = myPersonId
		this.packedMessages = []
	}

	setPackedMessages (packedMessages) {
		this.packedMessages = unWatch(packedMessages)
	}

	packMessage (rawMessage) {
		const packedMessage = {
			label: moment(new Date(rawMessage.updated_at)).format('MMMM D'),
			key: rawMessage.id,
			createdBy: unWatch(this.persons.find((person) => person.id === rawMessage.created_by)),
			sent: this.myPersonId === rawMessage.created_by,
			date: rawMessage.updated_at,
			list: [
				rawMessage
			]
		}

		packedMessage.createdBy.avatar = new URL(packedMessage.createdBy.avatar).pathname

		return packedMessage
	}

	addRawMessageToPack (message) {
		let isSameAuthorAsLastMessage = false
		let isTheSameDateAsLastMessage = false

		if (this.packedMessages.length >= 1) {
			const lastMessage = this.packedMessages[this.packedMessages.length - 1]
			isSameAuthorAsLastMessage = lastMessage.createdBy.id === parseInt(message.created_by)
			isTheSameDateAsLastMessage = date.isSameDate(lastMessage.date, message.updated_at, 'day')
		}

		if (isSameAuthorAsLastMessage && isTheSameDateAsLastMessage) {
			this.packedMessages[this.packedMessages.length - 1].list.push(message)
		} else {
			const packedMessage = this.packMessage(message)
			this.packedMessages.push(packedMessage)
		}
	}

	removeMessageFromThePackById (id) {
		for (const [index, packedMessage] of this.packedMessages.entries()) {
			const message = packedMessage.list.find((rawMessage) => rawMessage.id === id)
			if (!message) continue

			const messageLength = this.packedMessages[index].list.length

			switch (true) {
			case messageLength === 1:
				this.packedMessages.splice(index, 1)
				return
			case messageLength > 1:
				removeElementById(this.packedMessages[index].list, { id })
				return
			default:
				throw new Error(`Unexpected message length: ${messageLength}`)
			}
		}
	}

	updateMessageFromThePack (originalMessage) {
		for (const [index, packedMessage] of this.packedMessages.entries()) {
			const message = packedMessage.list.find((rawMessage) => rawMessage.id === originalMessage.id)
			if (message) {
				updateElementById(this.packedMessages[index].list, originalMessage)
				break
			}
		}
	}
}
