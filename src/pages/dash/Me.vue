<template>
  <q-page class="flex q-layout-padding">
    <div class="full-width">
      <q-tabs
        class="bg-secondary"
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
                  <q-card-section class="col-xs-12 col-sm-6 col-md-6">
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
                        maxlength="20"
                        hint="20 chars maximum"
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
                  <q-separator
                    v-show="$q.screen.gt.xs"
                    dark
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
        <q-tab-panel name="avatar">
          <q-card dark flat class="bg-primary">
            <q-card-section class="items-center">
              <AvatarUploader/>
            </q-card-section>
          </q-card>
        </q-tab-panel>
        <q-tab-panel name="security">
          <SettingPanelCard :default-pre-text="defaultPreText">
            <!-- Password card -->
            <!-- @todo Better to move it to separate component -->
            <template #section>
              <q-card-section horizontal>
                <q-card-section class="col-xs-12 col-sm-6">
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
                <q-separator
                  v-show="$q.screen.gt.xs"
                  dark
                  vertical />
                <q-card-section
                  v-show="$q.screen.gt.xs"
                  class="col-5">
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
import SettingPanelCard from 'components/elements/SettingPanelCard'
import AvatarUploader from 'components/elements/AvatarUploader'
import { Dialogs } from 'pages/mixins/dialogs'
import { loading } from '../mixins/loading'

export default {
	name: 'AccountView',
	components: { AvatarUploader, SettingPanelCard },
	mixins: [
		Dialogs,
		loading
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
				this.$store.dispatch('auth/UPDATE_MY_DATA', payload)
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
				await this.$store.dispatch('auth/UPDATE_MY_PASSWORD', payload)
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
}
</script>
