<template>
  <q-page-sticky position="top-right" :offset="[50, 50]">
    <q-fab
      outline
      icon="mdi-cog"
      direction="left"
      color="amber">
      <q-fab-action
        @click="showConnectionEditDialog"
        outline
        class="q-pa-sm"
        label="Set Host"
        text-color="amber"
        icon="mdi-connection" />
			<q-fab-action
				@click="showAboutDialog"
				outline
				class="q-pa-sm"
				label="About"
				text-color="amber"
				icon="mdi-information" />
    </q-fab>
  </q-page-sticky>
</template>

<script>
import ConnectionEditDialog from 'components/dialogs/ConnectionEditDialog.vue'
import AboutDialog from '../dialogs/AboutDialog.vue'

export default {
	name: 'ChangeConnectionElement',
	methods: {
		showConnectionEditDialog () {
			this.$q.dialog({
				parent: this,
				dark: true,
				component: ConnectionEditDialog
			})
		},
		showAboutDialog () {
			this.$q.dialog({
				parent: this,
				dark: true,
				component: AboutDialog
			})
		}
	}
}
</script>

<style scoped>

</style>
