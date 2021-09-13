<template>
  <q-card flat class="overflow-hidden no-scroll">
    <q-card-section class="q-pa-xs">
      <slot name="default_pre_text">
        <p class="text-secondary">{{ defaultPreText }}</p>
      </slot>
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
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'SettingPanelCard',
	props: {
		areActions: {
			type: Boolean,
			default: false
		},
		isAdditionalSection: {
			type: Boolean,
			default: false
		},
		defaultPreText: {
			type: String,
			default: '* All changes will take effect 1 second after input value'
		}
	}
})
</script>

<style scoped>

</style>
