import { date } from 'quasar'
import $store from 'src/store'

function formatDate (dateByString) {
	return date.formatDate(new Date(dateByString), 'MMMM D')
}

function createPackFromMessage (message, mine = false, label = false) {
	return {
		label: label ? formatDate(message.created_at) : false,
		key: message.id,
		createdBy: $store.getters['auth/PERSON_BY_ID'](message.created_by),
		sent: mine,
		text: [
			message.description
		],
		date: new Date(message.created_at),
		list: [
			message
		]
	}
}

function addMessageToLastPack (message, pack) {
	const injectPoint = pack.length - 1

	pack[injectPoint].list.push(message)
	pack[injectPoint].text.push(message.description)
	pack[injectPoint].date = new Date(message.created_at)
}

export function packMessages (messages, myId) {
	/** Object example
	 * {
	 * "id": 5,
	 * "issue": 1,
	 * "description": "What are you doing?",
	 * "created_by": 1,
	 * "created_at": "2021-06-12T01:01:01.823372Z",
	 * "updated_at": "2021-07-14T14:05:03.931169Z"
	 * }
	 *...
	 *
	 * We can group messages together if:
	 * 1) In the same day
	 * 2) Messages go in a row
	 *
	 * Result example:
	 * {
	 *   label: "17 November",
	 *   key: 11 // First message id,
	 *   createdBy: {
	 *     here is Person Object
	 *   },
	 *   sent: true // false if that is not mine message pack,
	 *   text: ['hi!', 'How are you?']
	 *   list: [
	 *     {
	 *       id: 5,
	 *       issue: 1,
	 *       description: "what are you doing?",
	 *       created_by: 1,
	 *       "created_at": "2021-06-12T01:01:01.823372Z",
	 * 			 "updated_at": "2021-07-14T14:05:03.931169Z"
	 *     },
	 *     {
	 *       id: 6,
	 *       issue: 1,
	 *       description: "huh?",
	 *       created_by: 1,
	 *       "created_at": "2021-06-12T01:01:01.823372Z",
	 * 			 "updated_at": "2021-07-14T14:05:03.931169Z"
	 *     }
	 *   ]
	 * }
	 *
	 * **/

	if (messages.length === 0) {
		return []
	}

	const __pack = []
	const unit = 'day'

	/** Let's do it for first element before entering the loop **/
	__pack.push(createPackFromMessage(messages[0], myId === messages[0].created_by, true))

	for (let i = 1; i < messages.length; i++) {
		/** We can group only messages from the same author **/
		const isMessageFromTheSameAuthorAsLastProcessed = messages[i].created_by === messages[i - 1].created_by
		const mine = myId === messages[i].created_by

		/** Is this message written in the same date as last processed **/
		const isMessageTheSameDateAsLastProcessed = date.isSameDate(
			new Date(messages[i].created_at),
			new Date(messages[i - 1].created_at),
			unit)

		if (isMessageFromTheSameAuthorAsLastProcessed && isMessageTheSameDateAsLastProcessed) {
			addMessageToLastPack(messages[i], __pack)
		} else if (isMessageTheSameDateAsLastProcessed) {
			__pack.push(createPackFromMessage(messages[i], mine))
		} else {
			__pack.push(createPackFromMessage(messages[i], mine, true))
		}
	}

	return __pack
}
