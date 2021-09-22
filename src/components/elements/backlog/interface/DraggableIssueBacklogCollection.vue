<template>
	<draggable
		v-bind="dragOptions"
		v-model="issues"
		@change="onChangeHandler($event)"
		@start="$emit('start', $event)"
		@end="$emit('end', $event)">
		<template #item="{ element }">
			<IssueBacklog :issue="element"/>
		</template>
	</draggable>
</template>

<script>
import { defineComponent } from 'vue'
import draggable from 'vuedraggable'
import IssueBacklog from 'components/elements/IssueBacklog'
import { CoreActionsMixin } from 'src/services/actions/core'

export default defineComponent({
	name: 'DraggableIssueBacklogCollection',
	emits: [
		'start',
		'end',
		'dragged'
	],
	mixins: [
		CoreActionsMixin
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
			/** Actually we don't need this emitter.
			 *  However we can pass draggable event to parent component
			 *  Maybe it will be useful in a future **/

			this.$emit('dragged', {
				event,
				collectionId: this.collectionId
			})
		}
	},
	computed: {
		issues () {
			return []
		}
	}
})
</script>
