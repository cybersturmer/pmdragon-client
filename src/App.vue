<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
	name: 'App',
	watch: {
		isDark (newState, oldState) {
			this.$q.dark.set(newState)
			this.$store.commit('current/SET_DARK_MODE', newState)
		}
	},
	mounted () {
		this.$q.dark.set(this.isDark)
	},
	computed: {
		isDark () {
			return this.$store.getters['current/IS_DARK']
		}
	}
}
</script>
