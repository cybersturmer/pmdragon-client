<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card dark flat bordered class="q-dialog-plugin bg-secondary overflow-hidden" >
      <q-card-section>
        <div class="text-h6 text-center text-uppercase">
          <q-icon
            name="mdi-form-select"
          />
          Choose file from ({{ workspace }})
        </div>
      </q-card-section>
      <q-card-section style="max-height: 50vh" class="q-pa-xs">
        <q-scroll-area dark visible style="height: 30vw; border: 2px solid #606060;">
          <q-list dark>
            <q-item
              v-for="attachment in attachments" :key="attachment.id"
              clickable
              v-ripple
              class="bg-primary"
              @click="selectAttachment(attachment)"
            >
              <q-item-section avatar>
                <q-icon :name="attachment.icon"/>
              </q-item-section>
              <q-item-section>
                {{ attachment.title }}
                <span class="text-amber" style="font-size: 0.75rem">
                  {{ attachment.created_by ? `${getParticipantTitleById(attachment.created_by)} -` : '' }}
                  ({{ attachment.updated_at | moment("from", "now") }})
                </span>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-card-section>
      <q-card-actions vertical>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'SelectAttachmentDialog',
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
      return this.$store.getters['issues/ATTACHMENTS_BY_CURRENT_PROJECT']
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
}
</script>
