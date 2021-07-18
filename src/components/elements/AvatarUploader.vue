<template>
  <q-uploader
    flat
    bordered
    ref="uploader"
    :accept="avatarAllowMimes"
    :max-files="1"
    :max-file-size="10485760"
    :max-total-size="10485760"
    :factory="uploadFileAvatar"
    auto-upload
    @removed="deleteAvatar"
    class="fit"
  >
    <template #header>
      <div
        v-if="!justUploaded" style="width: 100%">
        <q-btn
          flat
          class="full-width"
					color="white"
          label="Upload avatar"
          icon="mdi-upload">
          <q-uploader-add-trigger />
        </q-btn>
      </div>
    </template>
    <template #list>
      <q-img
        v-if="avatarUrl"
        :src="avatarUrl"
        contain
        native-context-menu>
        <q-btn
          flat
          round
					style="top: 8px; right: 8px"
          class="absolute all-pointer-events"
          icon="mdi-delete"
          @click="deleteAvatar">
          <q-tooltip>
            Remove avatar
          </q-tooltip>
        </q-btn>
        <q-btn
          flat
          round
          style="top: 8px; right: 45px"
          class="absolute all-pointer-events"
          icon="mdi-update">
          <q-uploader-add-trigger />
          <q-tooltip>
            Update avatar
          </q-tooltip>
        </q-btn>
      </q-img>
    </template>
  </q-uploader>
</template>

<script>
import { AVATAR_ALLOW_MIMES } from 'src/services/allow'

export default {
	name: 'AvatarUploader',
	methods: {
		uploadFileAvatar (files) {
			files.forEach(file => {
				return this.$store.dispatch('auth/UPDATE_MY_AVATAR', file)
			})

			this.justUploaded = true
		},
		async deleteAvatar () {
			await this.$store.dispatch('auth/DELETE_MY_AVATAR')
			this.justUploaded = false
		}
	},
	computed: {
		avatarUrl () {
			return this.$store.getters['auth/MY_AVATAR']
		}
	},
	data () {
		return {
			maxFiles: 1,
			maxFileSize: 10485760,
			maxTotalSize: 10485760,
			avatarAllowMimes: AVATAR_ALLOW_MIMES,
			justUploaded: false,
			reUploadIntended: true
		}
	}
}
</script>
<style lang="scss">
	.q-uploader {
		max-height: none;
		min-width: 300px;
	}

	.q-uploader_full {
		width: auto!important;
		max-height: fit-content!important;
	}

	.q-uploader__header {
		background-color: #2e2e2e;
	}

  .q-uploader__list {
    font-size: 0.5em;
    padding: 5px;
    background-color: $accent;
    overflow: hidden;
  }

  .q-uploader__file--img {
    min-width: initial;
    background-size: contain;
  }

  .q-uploader__subtitle {
    font-size: 10px;
  }

  .q-uploader__title {
    font-size: 12px!important;
  }

  .q-uploader__list {
    padding: 0;
  }
</style>
