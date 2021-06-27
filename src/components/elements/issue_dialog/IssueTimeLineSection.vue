<template>
	<q-card-section class="q-py-xs">
		<q-timeline dark
								:layout="timelineLayout"
								color="amber">
			<IssueTimeLineEntry v-for="entry in history"
													:entry="entry"
													:key="entry.id"/>
		</q-timeline>
	</q-card-section>
</template>

<script>
import IssueTimeLineEntry from './IssueTimeLineEntry'

export default {
	name: 'IssueTimeLineSection',
	components: { IssueTimeLineEntry },
	props: {
		history: {
			type: Array,
			required: false
		}
	},
	computed: {
		timelineLayout () {
			return this.$q.screen.lt.sm ? 'dense' : (this.$q.screen.lt.md ? 'comfortable' : 'loose')
		}
	},
	methods: {
		buildTimeLineEntryTitle (entry) {
			/** Here we can make a title for issue event **/
			const participantTitle = this.getParticipantTitleById(entry.changed_by)

			let action = ''
			switch (entry.edited_field) {
			case 'Ordering':
				action = parseInt(entry.before_value) > parseInt(entry.after_value)
					? 'increased'
					: 'decreased'
				action += ' priority'
				break
			case null:
				action = ''
				break
			default:
				action = `updated ${entry.edited_field}`
			}

			switch (entry.entry_type) {
			case 'mdi-playlist-edit':
				return `${participantTitle} ${action}`
			case 'mdi-playlist-plus':
				return `${participantTitle} created this Issue`
			default:
				return `${participantTitle} did (${entry.entry_type})`
			}
		}
	}
}
</script>

<style scoped>

</style>
