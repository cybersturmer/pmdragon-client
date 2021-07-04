<template>
  <q-btn-group flat>
    <!-- Share button -->
    <q-btn
      flat
      dense
      icon="mdi-link-variant"
      @click="copyLink"/>
		<q-btn
			flat
			dense
			icon="mdi-cloud-refresh"
			@click="refresh"/>
    <!-- More button -->
    <q-btn
      flat
      dense
      icon="mdi-dots-vertical">
      <IssueMorePopupMenu
        @remove="hide"
        :issue="issue"/>
    </q-btn>
    <q-btn
      flat
      dense
      icon="mdi-close"
      @click="hide"
    />
  </q-btn-group>
</template>

<script>
import { copyToClipboard } from 'quasar'
import { Notifications } from 'pages/mixins/notifications'
import IssueMorePopupMenu from '../../popups/IssueMorePopupMenu'

export default {
	name: 'IssueHeader',
	mixins: [Notifications],
	components: { IssueMorePopupMenu },
	props: {
	  issue: {
	    type: Object,
			required: true
		}
	},
	methods: {
		copyLink () {
			/** Copy link to issue in buffer **/
			const host = this.$store.getters['connection/HOST']
			const text = `${host}/dash/issue/${this.issue.id}`
			copyToClipboard(text)
				.then(() => this.showInformalNotification('Link copied to clipboard'))
		},
		refresh () {
			this.$emit('refresh')
		},
		hide () {
		  this.$emit('hide')
		}
	}
}
</script>
