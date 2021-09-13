<template>
  <q-input
    flat
    color="secondary"
    :modelValue="rawDatetime"
    :label="label"
    @input="handleInput">
    <template v-slot:prepend>
      <q-icon name="mdi-calendar" class="cursor-pointer">
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-date
            :modelValue="rawDatetime"
            @update:modelValue="handleInput($event)"
            :mask="mask" />
        </q-popup-proxy>
      </q-icon>
    </template>

    <template v-slot:append>
      <q-icon name="mdi-clock-outline" class="cursor-pointer">
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-time
            :modelValue="rawDatetime"
            @update:modelValue="handleInput($event)"
            :mask="mask"
            :minute-options="minuteOptions"
            format24h />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script>
import { defineComponent } from 'vue'
import { DATETIME_MASK } from 'src/services/masks'

export default defineComponent({
	name: 'DateTimeField',
	emits: [
		'update:modelValue'
	],
	props: {
		value: String,
		label: String
	},
	data () {
		return {
			mask: DATETIME_MASK,
			minuteOptions: [0, 15, 30, 45],
			rawDatetime: this.value
		}
	},
	computed: {
		datetime () {
			return this.rawDatetime
		}
	},
	methods: {
		handleInput (value) {
			this.rawDatetime = value
			this.$emit('update:modelValue', value)
		}
	}
})
</script>

<style scoped>

</style>
