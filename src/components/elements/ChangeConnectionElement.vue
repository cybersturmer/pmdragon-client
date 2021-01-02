<template>
  <q-page-sticky position="top-right" :offset="[50, 50]">
    <q-fab
      outline
      icon="settings"
      direction="left"
      color="amber">
      <q-fab-action
        @click="showConnectionEditDialog"
        outline
        class="q-pa-sm"
        label="Set Host"
        text-color="amber"
        icon="electrical_services" />
    </q-fab>
  </q-page-sticky>
</template>

<script>
import ConnectionEditDialog from 'components/dialogs/ConnectionEditDialog.vue'

export default {
  name: 'ChangeConnectionElement',
  methods: {
    showConnectionEditDialog () {
      this.$q.dialog({
        parent: this,
        dark: true,
        component: ConnectionEditDialog
      })
    }
  }
}
</script>

<style scoped>

</style>
