<template>
  <q-menu fit anchor="bottom start" self="top start" auto-close>
    <q-list dense style="min-width: 150px">
      <q-item
        clickable
        v-close-popup
        @click="removeIssue">
        <q-item-section>
          Remove Issue
        </q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script>
import { defineComponent } from 'vue'
import { Dialogs } from 'pages/mixins/dialogs'
import { CoreActionsMixin } from 'src/services/actions/core'

export default defineComponent({
	name: 'IssueMorePopupMenu',
	emits: [
		'remove'
	],
	mixins: [
		Dialogs,
		CoreActionsMixin
	],
	props: {
		issue: {
			type: Object,
			required: true
		}
	},
	methods: {
		removeIssue () {
			const dialog = [
				'Confirmation',
				`Would you like to delete issue: "${this.issue.title}"`,
				'Remove',
				'danger'
			]

			this.showOkCancelDialog(...dialog)
				.onOk(() => {
					try {
						this.deleteIssue(this.issue)
						if (this.$route.name === 'issue') {
							this.$router.push({ name: 'backlog' })
						}

						this.$emit('remove', this.issue.id)
					} catch (e) {
						this.showError(e)
					}
				})
		}
	}

})
</script>

<style scoped>

</style>
