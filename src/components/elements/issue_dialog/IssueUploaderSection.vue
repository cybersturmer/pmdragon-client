<template>
  <!-- Attachments -->
  <q-card-section>
    <q-uploader
      flat
      ref="uploader"
      auto-upload
      :factory="uploadFileAttachment"
      :max-file-size="10485760"
      class="full-width">
      <template #header>
        <div :class="`${$q.dark.isActive ? 'bg-dark text-secondary' : 'bg-secondary text-dark' }`">
          <span v-if="$q.screen.gt.sm"
                class="text-bold q-pl-md text-uppercase">
            Attachments [{{ attachmentsAmount }}]&nbsp;
          </span>
          <q-btn
            flat
            label="Upload file"
            icon="mdi-upload">
            <q-uploader-add-trigger />
          </q-btn>
          <q-btn
            flat
            label="Link file"
            icon="mdi-link-plus"
            @click="showSelectAttachmentDialog"
          />
        </div>
      </template>
      <template #list class="q-pa-none">
        <q-scroll-area
          horizontal
          visible
          style="height: 58px; border: 1px solid #727272"
          :class="`no-scroll q-pa-sm rounded-borders ${$q.dark.isActive ? 'bg-dark' : 'bg-secondary'}`">
          <div class="row no-wrap">
            <div
              v-for="attachment in attachments"
              :key="attachment.id"
              class="truncate-chip-labels text-weight-bold">
              <q-chip
                square
                removable
                clickable
                :icon="attachment.icon"
                :label="attachment.title"
                @remove="deleteFileAttachmentFromIssue(attachment)"
                @click="downloadOrOpenFile(attachment.attachment, attachment.title)"
              />
            </div>
          </div>
        </q-scroll-area>
      </template>
    </q-uploader>
  </q-card-section>
</template>

<script>
import SelectAttachmentDialog from 'src/components/dialogs/SelectAttachmentDialog'
import { removeElement, unWatch } from 'src/services/util'
import { platformOpenURL } from 'src/services/platforms'
import { downloadFile } from 'src/services/cordova/download'
import axios from 'axios'

export default {
	name: 'IssueUploaderSection',
	props: {
	  issue: {
	    type: Object,
			required: true
		}
	},
	methods: {
		downloadOrOpenFile (url, filename = null) {
			// @todo refactor to one root point axios
			if (this.$q.platform.is.android || this.$q.platform.is.ios) {
				try {
					const response = axios({
						url: url,
						method: 'GET',
						responseType: 'blob'
					})

					const blobFile = new Blob([response.data])
					downloadFile(blobFile, filename)
				} catch (e) {
					console.log(e)
				}
			} else {
				platformOpenURL(url)
			}
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
				dark: this.$q.dark.isActive,
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
