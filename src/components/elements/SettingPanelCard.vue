<template>
  <q-card dark flat class="bg-primary">
    <q-card-section class="q-pa-xs">
      <p class="text-amber">*All changes will take effect immediately after leaving field</p>
    </q-card-section>
    <q-card-section class="q-pa-xs">
      <slot name="section">
        section for overriding
      </slot>
    </q-card-section>
    <q-card-section
      v-if="isAdditionalSection">
      <slot name="additionalSection">
        Here is additional section
      </slot>
    </q-card-section>
    <q-card-section class="q-pa-xs q-ma-xs"
      v-if="areActions">
      <slot name="actions">
      actions
      </slot>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'SettingPanelCard',
  props: {
    areActions: {
      type: Boolean,
      default: false
    },
    isAdditionalSection: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>

</style>
