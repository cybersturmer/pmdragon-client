<template>
  <q-page-sticky position="top-right" :offset="[50, 50]">
    <q-fab
      icon="settings"
      direction="left"
      color="primary">
      <q-fab-action
        label="Set custom host"
        color="primary"
        icon="electrical_services" />
    </q-fab>
  </q-page-sticky>
</template>

<script>
export default {
  name: 'ChangeConnectionElement'
}
</script>

<style scoped>

</style>
