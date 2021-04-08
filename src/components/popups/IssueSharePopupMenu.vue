<template>
  <q-menu dark fit
          anchor="bottom start"
          self="top start"
          auto-close>
    <q-list dense style="min-width: 150px">
      <q-item
        clickable
        v-close-popup
        @click="copyLink">
        <q-item-section>Copy link</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script>
import { copyToClipboard } from 'quasar'
import { Notifications } from 'pages/mixins/notifications'

export default {
	name: 'IssueSharePopupMenu',
	mixins: [Notifications],
	props: {
		issue: {
			type: Object,
			required: true
		}
	},
	methods: {
		copyLink () {
			const host = this.$store.getters['connection/HOST']
			const text = `${host}/dash/issue/${this.issue.id}/`
			copyToClipboard(text)
				.then(() => this.showInformalNotification('Link copied to clipboard'))
		}
	}

}
</script>

<style scoped>

</style>
