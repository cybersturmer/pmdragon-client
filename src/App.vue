<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
	name: 'App',
	mounted () {
		this.$q.dark.set(this.$store.getters['current/IS_DARK'])
	}
}
</script>
