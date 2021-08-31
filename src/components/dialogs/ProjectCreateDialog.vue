<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card flat bordered class="q-dialog-plugin">
      <q-card-section>
        <q-select
          flat
          square
          dense
					:modelValue="formData.workspace"
					@update:modelValue="updateWorkspace($event)"
					:options="workspaces"
          :option-label="(item) => item.prefix_url"
          option-value="id"
        />
        <q-input
          v-model="formData.title"
          label="Project title"
          :error="isFieldValid('formErrors','title')"
          :error-message="formErrors.title"
          label-color="secondary"/>
        <q-input
          v-model="formData.key"
          label="Project key"
          :error="isFieldValid('formErrors','key')"
          :error-message="formErrors.key"
          label-color="secondary"/>
      </q-card-section>
      <q-card-actions vertical class="text-center">
        <q-btn
          outline
          label="Create"
          @click="onOKClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { fieldValidationMixin } from 'pages/mixins/fieldValidation'
import { Dialogs } from 'pages/mixins/dialogs'
import { AuthActionsMixin } from 'src/services/actions/auth'

export default {
	name: 'ProjectCreateDialog',
	emits: [
		'ok',
		'hide'
	],
	mixins: [
		fieldValidationMixin,
		AuthActionsMixin,
		Dialogs
	],
	props: {
		workspaceId: {
			type: Number,
			required: false
		}
	},
	data () {
		return {
			formData: {
				workspace: this.$store.getters['auth/WORKSPACE_BY_ID'](this.workspaceId) || this.$store.getters['auth/WORKSPACE_FIRST'],
				title: '',
				key: ''
			},
			formErrors: {
				workspace: '',
				title: '',
				key: ''
			}
		}
	},
	methods: {
		updateWorkspace ($event) {
			this.formData.workspace = $event.id
		},

		show () {
			this.$refs.dialog.show()
		},

		hide () {
			this.$refs.dialog.hide()
		},

		onDialogHide () {
			this.$emit('hide')
		},

		inputPrefixUrl ($event) {
			this.resetFieldErrorMessage('formErrors', 'prefix_url')
			this.formData.prefix_url = $event
		},

		async onOKClick () {
			const payload = {
				workspace: this.formData.workspace.id,
				title: this.formData.title,
				key: this.formData.key
			}

			try {
				const emitPayload = await this.addProject(payload)
				this.$emit('ok', emitPayload)
				this.hide()
			} catch (e) {
				e.setErrors(this.formErrors)
				this.showError(e)
			}
		},

		onCancelClick () {
			this.hide()
		}
	},
	computed: {
		workspaces () {
			return this.$store.getters['auth/WORKSPACES']
		}
	}
}
</script>
