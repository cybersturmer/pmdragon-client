<template>
	<draggable
		v-bind="dragOptions"
		:list="issues"
		@change="onChangeHandler($event)"
		@start="$emit('start', $event)"
		@end="$emit('end', $event)"
		:component-data="{ name: 'fade' }">
		<template #item="{ element }">
			<IssueBacklog :issue="element"/>
		</template>
	</draggable>
</template>

<script>
import draggable from 'vuedraggable'
import IssueBacklog from 'components/elements/IssueBacklog'

export default {
	name: 'DraggableIssuesCollection',
	emits: [
		'start',
		'end',
		'dragged'
	],
	components: {
		IssueBacklog,
		draggable
	},
	props: {
		collectionId: {
			type: Number,
			required: true
		},
		dragOptions: {
			type: Object,
			required: true
		}
	},
	data () {
		return {
			dragTypes: {
				SPRINT: 1,
				BACKLOG: 0
			}
		}
	},
	methods: {
		onChangeHandler (event) {
			console.log('DraggableIssueCollection - On Change Handler')
			console.log(event)
			this.$emit('dragged', {
				event,
				collectionType: this.collectionType,
				collectionId: this.collectionId
			})
		}
	},
	computed: {
		issues () {
			return []
		}
	}
}
</script>
