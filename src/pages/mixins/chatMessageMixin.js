export const ChatMessageMixin = {
	props: {
		message: {
			type: Object,
			required: true
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
					: this.person.username
			} catch (e) {
				return ''
			}
		},
		avatar () {
			return this.person.avatar
		},
		isItMe () {
			/** Return true if given id is current user id **/
			return this.$store.getters['auth/IS_ME_BY_ID'](this.message.created_by)
		},
		size () {
			return this.$q.screen.lt.sm ? '9' : '6'
		},
		getRelativeDatetime () {
			/** Get relative datetime for messages (example: "an hour ago") **/
			return this.$moment(this.message.updated_at).fromNow()
		}
	},
	methods: {
		edit (chat) {
			chat.reset()
			this.$emit('edit', this.message.id)
		},
		remove (chat) {
			chat.reset()
			this.$emit('remove', this.message.id)
		}
	}
}
