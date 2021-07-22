export const ChatMessageMixin = {
	emits: [
		'edit',
		'remove'
	],
	props: {
		messagePack: {
			type: Object,
			required: true
		}
	},
	computed: {
		person () {
			return this.messagePack.createdBy
		},
		title () {
			try {
				return this.$q.screen.gt.sm
					? `${this.person.username} (${this.person.first_name} ${this.person.last_name})`
					: `@${this.person.username}`
			} catch (e) {
				return ''
			}
		},
		avatar () {
			try {
				return this.person.avatar
			} catch (e) {
				return ''
			}
		},
		sent () {
			return this.messagePack.sent
		},
		isManageable () {
			return this.messagePack.sent
		},
		size () {
			return this.$q.screen.lt.sm ? '9' : '6'
		},
		getRelativeDatetime () {
			/** Get relative datetime for messages (example: "an hour ago") **/
			return this.$moment(this.messagePack.date).fromNow()
		},
		color () {
			return this.sent ? 'info' : 'primary'
		}
	},
	methods: {
		edit (chat, messageId) {
			if ('reset' in chat) {
				chat.reset()
			}

			this.$emit('edit', messageId)
		},
		remove (chat, messageId) {
			if ('reset' in chat) {
				chat.reset()
			}

			this.$emit('remove', messageId)
		}
	}
}
