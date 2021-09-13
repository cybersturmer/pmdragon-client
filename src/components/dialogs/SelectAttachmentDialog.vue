<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card flat bordered class="q-dialog-plugin overflow-hidden" >
      <q-card-section>
        <div class="text-h6 text-center text-uppercase">
          <q-icon
            name="mdi-form-select"
          />
          Choose file from ({{ workspace }})
        </div>
      </q-card-section>
      <q-card-section style="max-height: 50vh" class="q-pa-xs">
        <q-scroll-area visible style="height: 30vw; border: 2px solid #606060;">
          <q-list>
						<AttachmentDialogItem
							v-for="attachment in attachments"
							:attachment="attachment"
							:key="attachment.id"
							@selected="selectAttachment(attachment)"/>
          </q-list>
        </q-scroll-area>
      </q-card-section>
      <q-card-actions vertical>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'
import AttachmentDialogItem from 'src/components/elements/AttachmentDialogItem'

export default defineComponent({
	name: 'SelectAttachmentDialog',
	emits: [
		'ok',
		'hide'
	],
	components: {
		AttachmentDialogItem
	},
	props: {
		issueId: {
			type: Number,
			required: true
		}
	},
	data () {
		return {
			selectedAttachment: null
		}
	},
	computed: {
		attachments () {
			return this.$store.getters['core/ATTACHMENTS_BY_CURRENT_PROJECT']
		},
		workspace () {
			return this.$store.getters['current/WORKSPACE']
		}
	},
	methods: {
		selectAttachment (attachment) {
			this.$emit('ok', attachment)
			this.hide()
		},
		getParticipantTitleById (id) {
			/** return title with username, first name and last name as a String **/
			const participant = this.$store.getters['auth/PERSON_BY_ID'](id)
			return participant.id ? `@${participant.username} (${participant.first_name} ${participant.last_name})` : ''
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

		async onOKClick () {
			this.$emit('ok', null)
			this.hide()
		},

		onCancelClick () {
			this.hide()
		}
	}
})
</script>
