<template>
  <q-page class="flex q-layout-padding">
    <div class="full-width">
      <q-tabs
        v-model="tab"
        dense
        align="justify"
        narrow-indicator>
        <q-tab
          name="general"
          icon="mdi-star-circle"
          label="General"/>
        <q-tab
          v-show="$q.screen.lt.sm"
          name="avatar"
          icon="mdi-image"
          label="Avatar"/>
        <q-tab
          name="security"
          icon="mdi-security"
          label="Security"/>
      </q-tabs>
      <q-separator />
      <q-tab-panels
        style="border: 1px solid #777"
        v-model="tab"
        animated
        transition-next="fade"
        transition-prev="fade">
        <q-tab-panel name="general" class="no-scroll">
          <!-- Main user Data card -->
          <!-- @todo Better to move it to separate component -->
          <SettingPanelCard :default-pre-text="defaultPreText">
              <template #section>
                <q-card-section horizontal>
                  <q-card-section class="col-xs-12 col-sm-6 col-md-6">
                    <q-card-section class="q-pa-sm">
                      <q-input
                        flat
                        type="text"
                        v-model="userFormData.firstName"
                        label="First name"
                      />
                      <q-input
                        flat
                        type="text"
                        v-model="userFormData.lastName"
                        label="Last name"
                      />
                      <q-input
                        flat
                        type="text"
                        v-model="userFormData.userName"
                        label="Username"
                        maxlength="20"
                        hint="20 chars maximum"
                        prefix="@"/>
                    </q-card-section>
                    <q-card-actions vertical>
                      <q-btn-group>
                        <q-btn
                          outline
                          label="Update data"
                          @click="saveUserData"/>
                      </q-btn-group>
                    </q-card-actions>
                  </q-card-section>
                  <q-separator
                    v-show="$q.screen.gt.xs"
                    vertical />
                  <q-card-section
                    v-show="$q.screen.gt.xs"
                    class="q-ml-xs q-pa-xs">
                    <AvatarUploader/>
                  </q-card-section>
                </q-card-section>
              </template>
            </SettingPanelCard>
        </q-tab-panel>
        <q-tab-panel name="avatar" class="no-scroll">
          <q-card flat>
            <q-card-section class="items-center">
              <AvatarUploader/>
            </q-card-section>
          </q-card>
        </q-tab-panel>
        <q-tab-panel name="security" class="no-scroll">
          <SettingPanelCard :default-pre-text="defaultPreText">
            <!-- Password card -->
            <!-- @todo Better to move it to separate component -->
            <template #section>
              <q-card-section horizontal>
                <q-card-section class="col-xs-12 col-sm-6">
                  <q-card-section>
                    <q-input
                      flat
                      type="password"
                      label="Old password"
                      v-model="passwordFormData.oldPassword"
                      class="q-mb-sm"
                    />
                    <q-input
                      flat
                      type="password"
                      label="Password"
                      v-model="passwordFormData.newPassword1"
                      class="q-mb-sm"
                    />
                    <q-input
                      flat
                      type="password"
                      label="Password confirmation"
                      v-model="passwordFormData.newPassword2"
                    />
                  </q-card-section>
                  <q-card-actions vertical>
                    <q-btn-group>
                      <q-btn
                        :disable="!arePasswords"
                        outline
                        label="Update password"
                        @click="savePassword"
                      />
                    </q-btn-group>
                  </q-card-actions>
                </q-card-section>
                <q-separator
                  v-show="$q.screen.gt.xs"
                  vertical />
                <q-card-section
                  v-show="$q.screen.gt.xs"
                  class="col-5">
                  <q-card-section>
                    <q-input
                      readonly
                      label="Email"
                      :modelValue="email"
                    />
                    <q-input
                      readonly
                      label="Last Login"
                      :modelValue="meLastLogin"
                    />
                    <q-input
                      readonly
                      label="Joined"
                      :modelValue="meCreatedAt"
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
import { defineComponent } from 'vue'
import SettingPanelCard from 'components/elements/SettingPanelCard'
import AvatarUploader from 'components/elements/AvatarUploader'
import { Dialogs } from 'pages/mixins/dialogs'
import { loading } from '../mixins/loading'
import { AuthActionsMixin } from 'src/services/actions/auth'

export default defineComponent({
	name: 'AccountView',
	components: { AvatarUploader, SettingPanelCard },
	mixins: [
		loading,
		Dialogs,
		AuthActionsMixin
	],
	data () {
		return {
			tab: 'general',
			defaultPreText: '* All changes will take effect after pressing update button.',
			reUploadIntended: true,
			justUploaded: false,
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
			this.showProgress()

			// Snake case cuz of API
			const payload = {
				first_name: this.userFormData.firstName,
				last_name: this.userFormData.lastName,
				username: this.userFormData.userName
			}

			try {
				this.updateMyPerson(payload)
			} catch (e) {
				this.showError(e)
			} finally {
				this.hideProgress()
			}
		},
		async savePassword () {
			this.showProgress()

			// Snake case cuz of API
			const payload = {
				old_password: this.passwordFormData.oldPassword,
				new_password1: this.passwordFormData.newPassword1,
				new_password2: this.passwordFormData.newPassword2
			}

			try {
				await this.updateMyPassword(payload)
				this.passwordFormData.oldPassword = ''
				this.passwordFormData.newPassword1 = ''
				this.passwordFormData.newPassword2 = ''
			} catch (e) {
				this.showError(e)
			} finally {
				this.hideProgress()
			}
		}
	},
	computed: {
		arePasswords () {
			return this.passwordFormData.newPassword1 &&
        this.passwordFormData.newPassword2 &&
        this.passwordFormData.oldPassword
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
	}
})
</script>
