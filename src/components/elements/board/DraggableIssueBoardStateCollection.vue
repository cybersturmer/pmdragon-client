<template>
	<draggable
		v-bind="dragOptions"
		v-model="issues"
		@change="onChangeHandler($event)"
		@start="onStart"
		@end="onEnd"
		:component-data="{ name: 'fade' }">
		<template #item="{ element }">
			<IssueBoard :issue="element"/>
		</template>
	</draggable>
</template>

<script>
import { defineComponent, getCurrentInstance, computed } from 'vue'
import { useStore } from 'vuex'
import draggable from 'vuedraggable'
import IssueBoard from 'components/elements/IssueBoard'
import { sortByOrdering } from 'src/services/util'
import { issueOrdering } from 'src/services/presets/core'

export default defineComponent({
	name: 'DraggableIssueBoardStateCollection',
	components: {
		IssueBoard,
		draggable
	},
	props: {
		stateCategory: {
			type: Number,
			required: true
		},
		dragOptions: {
			type: Object,
			required: true
		}
	},
	emits: [
		'dragged',
		'start',
		'end'
	],
	setup (props, context) {
		const store = useStore()
		const vueInstance = getCurrentInstance()

		/** Computed values */
		const issues = computed({
			get () {
				return store
					.getters['core/SPRINT_ISSUES_BY_CURRENT_PROJECT_AND_STATE_ID'](props.stateCategory)
					.sort(sortByOrdering)
			},
			async set (value) {
				if (value.length < 1) return

				const updateOrderPayload = []

				for (const [index, issue] of value.entries()) {
					updateOrderPayload.push({
						id: issue?.id,
						ordering: index
					})
				}

				const { $http } = vueInstance.appContext.config.globalProperties
				await $http.chain(issueOrdering, updateOrderPayload)

				store.commit('core/UPDATE_ISSUES_ORDERING', updateOrderPayload)
			}
		})

		/** Methods list */
		const onChangeHandler = async (event) => {
			context.emit('dragged', {
				event,
				issueStateId: props.stateCategory
			})
		}

		const onStart = async (event) => {
			context.emit('start', event)
		}

		const onEnd = async (event) => {
			context.emit('end', event)
		}

		return {
			issues,
			onChangeHandler,
			onStart,
			onEnd
		}
	}
})
</script>
