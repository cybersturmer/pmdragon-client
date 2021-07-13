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
				label-position="top"
        text-color="amber"
        icon="mdi-connection" />
			<q-fab-action
				@click="toggleLightOrDarkMode"
				outline
				class="q-pa-sm"
				:label="lightOrDarkModeLabel"
				label-position="top"
				text-color="amber"
				icon="mdi-theme-light-dark" />
			<q-fab-action
				@click="showAboutDialog"
				outline
				class="q-pa-sm"
				label="About"
				label-position="top"
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
			const payload = this.$q.dark.isActive
			this.$store.commit('current/SET_DARK_MODE', !payload)
			this.$q.dark.set(!payload)
		}
	},
	computed: {
		isDark () {
			return this.$q.dark.isActive
		},
		lightOrDarkModeLabel () {
			return this.$q.dark.isActive ? 'To Light Mode' : 'To Dark Mode'
		}
	}
}
</script>

<style scoped>

</style>
