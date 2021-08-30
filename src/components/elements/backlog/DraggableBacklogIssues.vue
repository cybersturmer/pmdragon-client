<script>
import DraggableIssuesCollection from 'components/elements/backlog/interface/DraggableIssuesCollection'

export default {
	name: 'DraggableBacklogIssues',
	extends: DraggableIssuesCollection,
	data () {
		return {
			collectionType: 0 // BACKLOG
		}
	},
	computed: {
		issues: {
			get () {
				return this.$store.getters['core/BACKLOG_ISSUES']
			},
			set (value) {
				const payload = {
					id: this.collectionId,
					issues: value
				}

				console.log('SENT PAYLOAD TO' + `BACKLOG ${this.collectionId}`)
				console.dir(payload)

				return this.$store.commit('core/UPDATE_BACKLOG_ISSUES', payload)
			}
		}
	}
}
</script>
