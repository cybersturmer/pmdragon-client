<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card flat bordered class="q-dialog-plugin">
      <q-card-section>
        <q-input
          v-model="form.title"
          flat
          type="text"
          label="Sprint title"
          label-color="secondary"
        />
        <q-input
          v-model="form.goal"
          flat
          type="text"
          label="Sprint Goal"
					label-color="secondary"
        />
        <DateTimeField
          v-model="form.startedAt"
          label="Started At"
        />
        <DateTimeField
          v-model="form.finishedAt"
          label="Finished At"
        />
      </q-card-section>
      <q-card-actions vertical>
        <q-btn
          outline
          color="secondary"
          label="Update"
          @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import DateTimeField from 'src/components/fields/DateTimeField'
import { date } from 'quasar'
import { DATETIME_MASK } from 'src/services/masks'

export default {
	name: 'SprintEditDialog',
	emits: [
		'ok',
		'hide'
	],
	components: { DateTimeField },
	props: {
		id: {
			type: Number,
			required: true
		},
		title: {
			type: String,
			required: true
		},
		goal: {
			type: String,
			required: true
		},
		startedAt: {
			type: String
		},
		finishedAt: {
			type: String
		}
	},
	data () {
		return {
			form: {
				id: this.id,
				title: this.title,
				goal: this.goal,
				startedAt: date.formatDate(this.startedAt, DATETIME_MASK),
				finishedAt: date.formatDate(this.finishedAt, DATETIME_MASK)
			}
		}
	},
	methods: {
		show () {
			this.$refs.dialog.show()
		},

		hide () {
			this.$refs.dialog.hide()
		},

		onDialogHide () {
			this.$emit('hide')
		},

		onOKClick () {
			const payload = {
				id: this.form.id,
				title: this.form.title,
				goal: this.form.goal,
				startedAt: date.formatDate(this.form.startedAt),
				finishedAt: date.formatDate(this.form.finishedAt)
			}

			this.$emit('ok', payload)
			this.hide()
		},

		onCancelClick () {
			this.hide()
		}
	}
}
</script>
