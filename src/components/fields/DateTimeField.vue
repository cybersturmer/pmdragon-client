<template>
  <q-input
    flat
    color="amber"
    :value="rawDatetime"
    :label="label"
    @input="handleInput">
    <template v-slot:prepend>
      <q-icon name="mdi-calendar" class="cursor-pointer">
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-date
            :value="rawDatetime"
            @input="handleInput($event)"
            color="amber"
            :mask="mask" />
        </q-popup-proxy>
      </q-icon>
    </template>

    <template v-slot:append>
      <q-icon name="mdi-clock-outline" class="cursor-pointer">
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-time
            :value="rawDatetime"
            @input="handleInput($event)"
            :mask="mask"
            :minute-options="minuteOptions"
            color="amber"
            format24h />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script>
import { DATETIME_MASK } from 'src/services/masks'

export default {
	name: 'DateTimeField',
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
			this.$emit('input', value)
		}
	}
}
</script>

<style scoped>

</style>
