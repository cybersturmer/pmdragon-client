<template>
  <!-- Attachments -->
  <q-card-section>
    <q-uploader
      dark
      flat
      ref="uploader"
      auto-upload
      :factory="uploadFileAttachment"
      :max-file-size="10485760"
      class="full-width">
      <template #header>
        <div>
          <span v-if="$q.screen.gt.sm"
                class="text-bold text-amber">
            ATTACHMENTS {{ attachmentsAmount }}
          </span>
          <q-btn
            dense
            flat
            label="Upload file"
            class="q-pl-sm q-pr-sm text-amber"
            icon="mdi-upload">
            <q-uploader-add-trigger />
          </q-btn>
          <q-btn
            dense
            flat
            label="Link file"
            class="q-pl-sm q-pr-sm text-amber"
            icon="mdi-link-plus"
            @click="showSelectAttachmentDialog"
          />
        </div>
      </template>
      <template #list>
        <q-scroll-area
          dark
          horizontal
          visible
          style="height: 55px;"
          class="bg-primary rounded-borders full-width"
        >
          <div class="row no-wrap">
            <div
              v-for="attachment in attachments"
              :key="attachment.id"
              class="q-pa-sm truncate-chip-labels">
              <q-chip
                dark
                square
                removable
                clickable
                color="primary"
                :icon="attachment.icon"
                :label="attachment.title"
                @remove="deleteFileAttachmentFromIssue(attachment)"
                @click="downloadFile(attachment.attachment)"
              />
            </div>
          </div>
        </q-scroll-area>
      </template>
    </q-uploader>
  </q-card-section>
</template>

<script>
import SelectAttachmentDialog from 'components/dialogs/SelectAttachmentDialog'
import { removeElement, unWatch } from '../../../services/util'

export default {
	name: 'IssueUploaderSection',
	props: {
	  issue: {
	    type: Object,
			required: true
		}
	},
	methods: {
		downloadFile (url) {
			window.open(url)
		},
		async uploadFileAttachment (files) {
			const payloadTemplate = {
				workspace: this.$store.getters['auth/WORKSPACE_ID'],
				project: this.$store.getters['current/PROJECT'],
				title: '',
				issue: this.issue.id
			}

			for (const file of files) {
				payloadTemplate.title = file.name

				const payload = {
					file: file,
					data: payloadTemplate
				}

				try {
					await this.$store.dispatch('core/ADD_ATTACHMENT', payload)
				} catch (e) {
					return Promise.reject('One of file was not uploaded')
				}
			}

			this.$nextTick(this.$refs.uploader.removeQueuedFiles)
			return Promise.resolve('Successfully uploaded')
		},
		async linkFileAttachment (attachment) {
			const issueId = this.issue.id
			const attachments = unWatch(this.$store.getters['core/ISSUE_BY_ID_ATTACHMENTS'](issueId))

			attachments.push(attachment.id)

			const payload = {
				id: issueId,
				attachments: attachments
			}

			await this.$store.dispatch('core/PATCH_ISSUE', payload)
		},
		async showSelectAttachmentDialog () {
			this.$q.dialog({
				parent: this,
				dark: true,
				title: 'Select attachment ',
				component: SelectAttachmentDialog,
				issueId: this.issue.id
			})
				.onOk((attachment) => {
					this.linkFileAttachment(attachment)
				})
		},
		async deleteFileAttachmentFromIssue (attachment) {
			const issueId = this.issue.id
			let patchedAttachments = unWatch(this.$store.getters['core/ISSUE_BY_ID_ATTACHMENTS'](issueId))

			patchedAttachments = removeElement(patchedAttachments, attachment.id)

			const payload = {
				id: issueId,
				attachments: patchedAttachments
			}

			await this.$store.dispatch('core/PATCH_ISSUE', payload)
		}
	},
	computed: {
		attachments () {
			try {
				const attachments = this.$store.getters['core/ISSUE_BY_ID_ATTACHMENTS'](this.issue.id)
				return this.$store.getters['core/ATTACHMENTS_BY_IDS'](attachments)
			} catch (e) {
				return []
			}
		},
		attachmentsAmount () {
			return this.$store.getters['core/ISSUE_BY_ID_ATTACHMENTS'](this.issue.id).length
		}
	}
}
</script>

<style scoped>

</style>
