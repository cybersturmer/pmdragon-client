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
          <SettingPanelCard>
              <template #section>
                <q-card-section horizontal>
                    <q-card-section class="col-md-9">
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
                      />
                    </q-card-section>
                    <q-separator dark vertical />
                    <q-card-section class="col-auto">
                      <q-uploader
                        dark
                        flat
                        :accept="avatarAllowMimes"
                        max-files="1"
                        :factory="uploadFileAvatar"
                        auto-upload
                        hide-upload-btn
                        @removed="onRemoved"
                        style="max-width: 180px"
                      />
                    </q-card-section>
                  </q-card-section>
              </template>
            </SettingPanelCard>
        </q-tab-panel>
        <q-tab-panel name="security">
          <SettingPanelCard>
            <!-- Password card -->
            <!-- @todo Better to move it to separate component -->
            <template #section>
              <q-input
                dark
                dense
                square
                outlined
                type="password"
                label="Old password"
                v-model="passwordFormData.oldPassword"
                class="q-mb-sm"
                standout="text-white bg-primary"
              />
              <q-input
                dark
                dense
                square
                outlined
                type="password"
                label="Password"
                v-model="passwordFormData.newPassword1"
                class="q-mb-sm"
                standout="text-white bg-primary"
              />
              <q-input
                dark
                dense
                square
                outlined
                type="password"
                label="Password confirmation"
                v-model="passwordFormData.newPassword2"
                standout="text-white bg-primary"
              />
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

export default {
  name: 'AccountView',
  components: { SettingPanelCard },
  data () {
    return {
      tab: 'general',
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
    saveUserData () {
      // Snake case cuz of API
      const payload = {
        first_name: this.userFormData.firstName,
        last_name: this.userFormData.lastName,
        username: this.userFormData.userName
      }

      this.$store.dispatch('auth/UPDATE_MY_DATA', payload)
    },
    savePassword () {
      // Snake case cuz of API
      const payload = {
        old_password: this.passwordFormData.oldPassword,
        new_password1: this.passwordFormData.newPassword1,
        new_password2: this.passwordFormData.newPassword2
      }

      this.$store.dispatch('auth/UPDATE_MY_PASSWORD', payload)
    },
    uploadFileAvatar (files) {
      files.forEach(file => {
        return this.$store.dispatch('auth/UPDATE_MY_AVATAR', file)
      })
    },
    onRemoved (file) {
      return this.$store.dispatch('auth/DELETE_MY_AVATAR')
    }
  },
  computed: {
    avatarUrl () {
      return this.$store.getters['auth/MY_AVATAR']
    },
    avatarAllowMimes () {
      return AVATAR_ALLOW_MIMES
    }
  },
  mounted () {

  }
}
</script>

<style lang="scss">
 .me_card {
   min-height: 200px;
   width: 213px;
 }

  .q-uploader__list {
    font-size: 0.5em;
    padding: 5px;
    background-color: $amber;
    overflow: hidden;
    height: 165px;
    max-height: 165px;
  }

 .q-uploader__file--img {
   min-width: initial;
   background-size: contain;
   background-repeat: space;
   height: 155px;
 }

  .q-uploader__subtitle {
   font-size: 10px;
  }

 .q-uploader__title {
   font-size: 12px!important;
 }

</style>
