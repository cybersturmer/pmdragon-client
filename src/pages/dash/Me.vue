<template>
  <q-page class="flex q-layout-padding">
    <div class="full-width">
      <q-tabs
        class="bg-secondary"
        v-model="tab"
        dense
        align="justify"
        narrow-indicator>
        <q-tab name="general" icon="stars" label="General"/>
        <q-tab name="security" icon="security" label="Security"/>
      </q-tabs>
      <q-separator dark/>
      <q-tab-panels
        class="bg-primary"
        style="border: 1px solid #777"
        v-model="tab"
        animated
        transition-next="fade"
        transition-prev="fade">
        <q-tab-panel name="general">
          <!-- Main user Data card -->
          <!-- @todo Better to move it to separate component -->
          <SettingPanelCard :default-pre-text="defaultPreText">
              <template #section>
                <q-card-section horizontal>
                  <q-card-section class="col-6">
                    <q-card-section class="q-pa-sm">
                      <q-input
                        dark
                        flat
                        type="text"
                        color="amber"
                        v-model="userFormData.firstName"
                        label="First name"
                      />
                      <q-input
                        dark
                        flat
                        type="text"
                        color="amber"
                        v-model="userFormData.lastName"
                        label="Last name"
                      />
                      <q-input
                        dark
                        flat
                        type="text"
                        color="amber"
                        v-model="userFormData.userName"
                        label="Username"
                        prefix="@"/>
                    </q-card-section>
                    <q-card-actions vertical>
                      <q-btn-group>
                        <q-btn
                          dark
                          outline
                          color="amber"
                          label="Update data"
                          @click="saveUserData"/>
                      </q-btn-group>
                    </q-card-actions>
                  </q-card-section>
                  <q-separator dark vertical />
                  <q-card-section class="col-5 q-ml-xs q-pa-xs">
                    <q-uploader
                      dark
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
                      class="full-height"
                    >
                      <template #header>
                        <div
                          v-if="!avatarUrl"
                          class="row no-wrap items-center justify-center">
                          <q-btn
                            dense
                            flat
                            class="full-width"
                            type="a"
                            label="Upload avatar"
                            icon="upload">
                            <q-uploader-add-trigger />
                          </q-btn>
                        </div>
                      </template>
                      <template #list>
                        <q-img
                          style="border-radius: 5px"
                          :src="avatarUrl"
                          contain
                          native-context-menu>
                          <q-btn
                            v-if="!reUploadIntended && avatarUrl"
                            flat
                            round
                            style="top: 8px; right: 8px"
                            class="absolute all-pointer-events"
                            icon="close"
                            @click="deleteAvatar">
                            <q-tooltip>
                              Remove avatar
                            </q-tooltip>
                          </q-btn>
                          <q-btn
                            v-if="!reUploadIntended && avatarUrl"
                            flat
                            round
                            style="top: 8px; right: 45px"
                            class="absolute all-pointer-events"
                            icon="update">
                            <q-uploader-add-trigger />
                            <q-tooltip>
                              Update avatar
                            </q-tooltip>
                          </q-btn>
                        </q-img>
                      </template>
                    </q-uploader>
                  </q-card-section>
                </q-card-section>
              </template>
            </SettingPanelCard>
        </q-tab-panel>
        <q-tab-panel name="security">
          <SettingPanelCard :default-pre-text="defaultPreText">
            <!-- Password card -->
            <!-- @todo Better to move it to separate component -->
            <template #section>
              <q-card-section horizontal>
                <q-card-section class="col-6">
                  <q-card-section>
                    <q-input
                      dark
                      flat
                      color="amber"
                      type="password"
                      label="Old password"
                      v-model="passwordFormData.oldPassword"
                      class="q-mb-sm"
                    />
                    <q-input
                      dark
                      flat
                      color="amber"
                      type="password"
                      label="Password"
                      v-model="passwordFormData.newPassword1"
                      class="q-mb-sm"
                    />
                    <q-input
                      dark
                      flat
                      color="amber"
                      type="password"
                      label="Password confirmation"
                      v-model="passwordFormData.newPassword2"
                    />
                  </q-card-section>
                  <q-card-actions vertical>
                    <q-btn-group>
                      <q-btn
                        :disable="!arePasswords"
                        dark
                        outline
                        color="amber"
                        label="Update password"
                        @click="savePassword"
                      />
                    </q-btn-group>
                  </q-card-actions>
                </q-card-section>
                <q-separator dark vertical />
                <q-card-section class="col-5">
                  <q-card-section>
                    <q-input
                      dark
                      readonly
                      label="Email"
                      color="amber"
                      :value="email"
                    />
                    <q-input
                      dark
                      readonly
                      label="Last Login"
                      color="amber"
                      :value="meLastLogin"
                    />
                    <q-input
                      dark
                      readonly
                      label="Joined"
                      color="amber"
                      :value="meCreatedAt"
                    />
                  </q-card-section>
                </q-card-section>
              </q-card-section>
            </template>
          </SettingPanelCard>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script>
import { AVATAR_ALLOW_MIMES } from 'src/services/allow'
import SettingPanelCard from 'components/elements/SettingPanelCard'
import { Dialogs } from 'pages/mixins/dialogs'

export default {
  name: 'AccountView',
  components: { SettingPanelCard },
  mixins: [Dialogs],
  data () {
    return {
      tab: 'general',
      defaultPreText: '* All changes will take effect after pressing update button.',
      reUploadIntended: false,
      userFormData: {
        firstName: this.$store.getters['auth/MY_FIRST_NAME'],
        lastName: this.$store.getters['auth/MY_LAST_NAME'],
        userName: this.$store.getters['auth/MY_USERNAME']
      },
      passwordFormData: {
        oldPassword: '',
        newPassword1: '',
        newPassword2: ''
      }
    }
  },
  methods: {
    cons (data) {
      console.log(data)
      return ''
    },
    pickFile () {
      this.$refs.uploader.pickFiles()
    },
    saveUserData () {
      // Snake case cuz of API
      const payload = {
        first_name: this.userFormData.firstName,
        last_name: this.userFormData.lastName,
        username: this.userFormData.userName
      }

      this.$store.dispatch('auth/UPDATE_MY_DATA', payload)
    },
    async savePassword () {
      // Snake case cuz of API
      const payload = {
        old_password: this.passwordFormData.oldPassword,
        new_password1: this.passwordFormData.newPassword1,
        new_password2: this.passwordFormData.newPassword2
      }

      try {
        await this.$store.dispatch('auth/UPDATE_MY_PASSWORD', payload)
        this.passwordFormData.oldPassword = ''
        this.passwordFormData.newPassword1 = ''
        this.passwordFormData.newPassword2 = ''
      } catch (e) {
        this.showError(e)
      }
    },
    uploadFileAvatar (files) {
      files.forEach(file => {
        return this.$store.dispatch('auth/UPDATE_MY_AVATAR', file)
      })
    },
    deleteAvatar () {
      return this.$store.dispatch('auth/DELETE_MY_AVATAR')
    }
  },
  computed: {
    arePasswords () {
      return this.passwordFormData.newPassword1 &&
        this.passwordFormData.newPassword2 &&
        this.passwordFormData.oldPassword
    },
    avatarUrl () {
      return this.$store.getters['auth/MY_AVATAR']
    },
    avatarAllowMimes () {
      return AVATAR_ALLOW_MIMES
    },
    email () {
      return this.$store.getters['auth/MY_EMAIL']
    },
    meCreatedAt () {
      try {
        const meCreatedAt = this.$store.getters['auth/ME_CREATED_AT']
        return this.$moment(meCreatedAt).fromNow()
      } catch (e) {
        return ''
      }
    },
    meLastLogin () {
      try {
        const meLastLogin = this.$store.getters['auth/ME_LAST_LOGIN']
        return this.$moment(meLastLogin).fromNow()
      } catch (e) {
        return ''
      }
    }
  },
  mounted () {

  }
}
</script>

<style lang="scss">
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

</style>
