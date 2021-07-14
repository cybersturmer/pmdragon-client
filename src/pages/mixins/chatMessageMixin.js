export const ChatMessageMixin = {
	props: {
		message: {
			type: Object,
			required: true
		}
	},
	data () {
		return {
			isMe: this.$store.getters['auth/IS_ME_BY_ID'](this.message.created_by)
		}
	},
	computed: {
		person () {
			return this.$store.getters['auth/PERSON_BY_ID'](this.message.created_by)
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
		isItMe () {
			/** Return true if given id is current user id **/
			return this.$store.getters['auth/IS_ME_BY_ID'](this.message.created_by)
		},
		sent () {
			return this.isItMe
		},
		size () {
			return this.$q.screen.lt.sm ? '9' : '6'
		},
		getRelativeDatetime () {
			/** Get relative datetime for messages (example: "an hour ago") **/
			return this.$moment(this.message.updated_at).fromNow()
		},
		color () {
			return this.isMe ? 'info' : 'primary'
		}
	},
	methods: {
		edit (chat) {
			if ('reset' in chat) {
				chat.reset()
			}

			this.$emit('edit', this.message.id)
		},
		remove (chat) {
			if ('reset' in chat) {
				chat.reset()
			}

			this.$emit('remove', this.message.id)
		}
	}
}
