<script>
import DraggableIssuesCollection from 'components/elements/backlog/interface/DraggableIssuesCollection'

export default {
	name: 'DraggableSprintIssues',
	extends: DraggableIssuesCollection,
	data () {
		return {
			collectionType: 1 // SPRINT
		}
	},
	computed: {
		issues: {
			get () {
				return this.$store.getters['core/SPRINT_BY_ID_ISSUES'](this.collectionId)
			},
			set (value) {
				const payload = {
					id: this.collectionId,
					issues: value
				}

				console.dir(payload)

				return this.$store.commit('core/UPDATE_SPRINT_ISSUES', payload)
			}
		}
	}
}
</script>
