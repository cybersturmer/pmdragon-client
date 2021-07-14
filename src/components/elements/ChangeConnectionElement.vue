<template>
  <q-page-sticky position="top-right" :offset="[50, 50]">
    <q-fab
      outline
      icon="mdi-cog"
      direction="left">
      <q-fab-action
        @click="showConnectionEditDialog"
        outline
        class="q-pa-sm"
        label="Set Host"
				label-position="top"
        icon="mdi-connection" />
			<q-fab-action
				@click="toggleLightOrDarkMode"
				outline
				class="q-pa-sm"
				:label="lightOrDarkModeLabel"
				label-position="top"
				icon="mdi-theme-light-dark" />
			<q-fab-action
				@click="showAboutDialog"
				outline
				class="q-pa-sm"
				label="About"
				label-position="top"
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
				dark: this.$q.dark.isActive,
				component: ConnectionEditDialog
			})
		},
		showAboutDialog () {
			this.$q.dialog({
				parent: this,
				dark: this.$q.dark.isActive,
				component: AboutDialog
			})
		},
		toggleLightOrDarkMode () {
			this.$q.dark.toggle()
		}
	},
	computed: {
		isDark () {
			return this.$q.dark.isActive
		},
		lightOrDarkModeLabel () {
			return `${this.$q.dark.isActive ? 'Light' : 'Dark'} Mode`
		}
	}
}
</script>

<style scoped>

</style>
