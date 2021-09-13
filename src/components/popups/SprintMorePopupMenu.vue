<template>
  <q-btn
    outline
		color="secondary"
    size="sm"
    icon="mdi-dots-horizontal">
    <q-menu fit anchor="top left" self="top right" auto-close>
      <q-list dense style="min-width: 150px">
        <q-item
          clickable
          v-close-popup
          @click="editSprintModal">
          <q-item-section>Edit Sprint</q-item-section>
        </q-item>
        <q-separator />
        <q-item
          clickable
          v-close-popup
          @click="removeSprintModal">
          <q-item-section>Remove Sprint</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'SprintMorePopupMenu',
	emits: [
		'edit',
		'remove'
	],
	props: {
		sprintId: {
			type: Number,
			required: true
		}
	},
	methods: {
		editSprintModal () {
			this.$emit('edit', this.sprintId)
		},
		removeSprintModal () {
			this.$emit('remove', this.sprintId)
		}
	}
})
</script>
<style lang="scss">

</style>
