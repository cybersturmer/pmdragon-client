<template>
	<q-timeline-entry :title="title"
										:subtitle="getRelativeDatetime"
										side="right"
										:class="$q.dark.isActive ? 'text-accent' : 'text-dark'"
										color="secondary"
										:icon="icon">
		<template #subtitle>
			<span :title="getFormattedDatetime">{{ getRelativeDatetime }}</span>
		</template>
		<template #default>
			<div class="row items-center">
				<div v-if="!isOrderingAction && !isDescription"
						 class="q-pa-none">
				<div
					v-if="beforeValue"
					v-html="beforeValue"
					class="q-pa-sm q-mb-sm bg-dark text-accent overflow-hidden"
					:style="valueClasses"/>
				<div
					v-if="afterValue"
					v-html="afterValue"
					class="q-pa-sm bg-info text-accent overflow-hidden"
					:style="valueClasses"/>
				</div>
			</div>
		</template>
	</q-timeline-entry>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'IssueTimeLineEntry',
	props: {
		entry: {
			type: Object,
			required: false
		}
	},
	data () {
		return {
			incText: 'increased',
			decText: 'decreased'
		}
	},
	computed: {
		isOrderingAction () {
			return this.entry.edited_field === 'Ordering'
		},
		isDescription () {
			return this.entry.edited_field === 'Description'
		},
		entryType () {
			return this.entry && 'entry_type' in this.entry ? this.entry.entry_type : 'mdi-radiobox-marked'
		},
		beforeValue () {
			return this.entry && 'before_value' in this.entry ? this.entry.before_value : false
		},
		afterValue () {
			return this.entry && 'after_value' in this.entry ? this.entry.after_value : false
		},
		icon () {
			return this.entryType ? this.entryType : 'mdi-radiobox-marked'
		},
		participantRepresentation () {
			return this.$q.screen.gt.sm
				? this.$store.getters['auth/PERSON_FULL_REPRESENTATION_BY_ID'](this.entry.changed_by)
				: `@${this.$store.getters['auth/PERSON_USERNAME_BY_ID'](this.entry.changed_by)}`
		},
		action () {
			let action = ''
			if (this.entry.edited_field === null) return action

			switch (this.entry.edited_field) {
			case 'Ordering':
				action = parseInt(this.entry.before_value) > parseInt(this.entry.after_value) ? this.incText : this.decText
				action += ' priority'
				break
			default:
				action = `updated ${this.entry.edited_field}`
			}

			return action
		},
		title () {
			switch (this.entryType) {
			case 'mdi-playlist-edit':
				return `${this.participantRepresentation} ${this.action}`
			case 'mdi-playlist-plus':
				return `${this.participantRepresentation} created this Issue`
			default:
				return `${this.participantRepresentation} did (${this.entry.entry_type})`
			}
		},
		isTimelineShowValues () {
			if (this.entry.edited_field === 'Ordering') {
				return false
			}

			return this.entry.before_value || this.entry.after_value
		},
		getRelativeDatetime () {
			/** Get relative datetime for messages (example: "an hour ago") **/
			return this.$moment(this.entry.updated_at).fromNow()
		},
		getFormattedDatetime () {
			return this.$moment(this.entry.updated_at).format('MMMM Do YYYY, h:mm:ss a')
		},
		valueClasses () {
			return 'border: 1px solid gray; border-radius: 5px; max-width: 100%'
		}
	}
})
</script>
