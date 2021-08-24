<template>
  <q-page-sticky position="top-right" :offset="[45, 45]">
    <q-fab
      outline
      icon="mdi-cog"
      direction="left">
      <q-fab-action
        @click="showConnectionEditDialog"
        outline
				padding="md"
        label="Host"
				label-position="bottom"
        icon="mdi-connection" />
			<q-fab-action
				@click="toggleLightOrDarkMode"
				outline
				padding="md"
				:label="lightOrDarkModeLabel"
				label-position="bottom"
				icon="mdi-theme-light-dark" />
			<q-fab-action
				@click="showAboutDialog"
				outline
				padding="md"
				label="About"
				label-position="bottom"
				icon="mdi-information" />
    </q-fab>
  </q-page-sticky>
</template>

<script>
import ConnectionEditDialog from 'src/components/dialogs/ConnectionEditDialog'
import AboutDialog from 'src/components/dialogs/AboutDialog'

export default {
	name: 'GeneralSettingsElement',
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
			const newIsDarkState = !this.$q.dark.isActive
			this.$store.commit('current/SET_DARK_MODE', newIsDarkState)
			this.$q.dark.toggle()
		}
	},
	computed: {
		isDark () {
			return this.$q.dark.isActive
		},
		lightOrDarkModeLabel () {
			return `${this.$q.dark.isActive ? 'Light' : 'Dark'}`
		}
	}
}
</script>

<style scoped>

</style>
