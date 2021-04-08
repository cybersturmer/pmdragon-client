<template>
  <q-page class="flex q-layout-padding">
    <div class="full-width">
        <q-tabs
          class="bg-secondary"
          v-model="tab"
          dense
          align="justify"
          narrow-indicator
        >
          <q-tab name="general" icon="mdi-star-circle" label="General"/>
          <q-tab name="issue_types" icon="mdi-receipt" label="Issue Types" />
          <q-tab name="issue_types_icons" icon="mdi-tooltip-image" label="Issue Types Icons" />
          <q-tab name="issue_states" icon="mdi-transit-connection-horizontal" label="Issue States" />
          <q-tab name="issue_estimations" icon="mdi-vote" label="Issue Estimations" />
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
            <SettingPanelCard are-actions>
              <template #section>
                <q-input
                  dark
                  flat
                  type="text"
                  label="Project name"
                  color="amber"
                  :value="projectTitle"
                  :debounce="debounceDefault"
                  @input="updateProject($event, 'title')"
                />
                <q-input
                  dark
                  flat
                  type="text"
                  label="Project key"
                  color="amber"
                  :value="projectKey"
                  :debounce="debounceDefault"
                  @input="updateProject($event, 'key')"
                />
                <q-select
                  dark
                  flat
                  label="Project owner"
                  :value="projectOwnedBy"
                  :options="participants"
                  :option-label="(item) => `${item.first_name} ${item.last_name}`"
                  hint="Right after changing it you will not be able anymore to change the project."
                  @input="updateProject($event, 'owned_by')"
                />
              </template>
              <template #actions>
                <q-btn-group>
                  <q-btn
                    color="red-14"
                    label="Remove project"
                    icon="mdi-delete"
                    @click="deleteProject"/>
                </q-btn-group>
                <p class="text-amber q-pt-sm">* By clicking it you will delete this project with all its issues,
                  issue types, issue states, issue estimations</p>
              </template>
            </SettingPanelCard>
          </q-tab-panel>

          <q-tab-panel name="issue_types">
            <SettingPanelCard are-actions>
              <template #section>
                <q-table
                  flat
                  square
                  dark
                  bordered
                  ref="issue_types_table"
                  row-key="title"
                  no-data-label="There are no issue types in your project"
                  :hide-bottom="true"
                  :data="issueTypes"
                  :columns="issueTypesTableData.columns"
                  :pagination="issueTypesTableData.pagination"
                >
                  <template #body-cell-title="props">
                    <q-td :props="props">
                      <q-input
                        dark
                        flat
                        borderless
                        type="text"
                        color="amber"
                        :value="props.row.title"
                        :debounce="debounceDefault"
                        @input="updateIssueType(props.row.id, 'title', $event)"
                      />
                    </q-td>
                  </template>
                  <template #body-cell-default="props">
                    <q-td :props="props">
                      <q-toggle
                        color="info"
                        :value="props.row.is_default"
                        @input="updateIssueType(props.row.id, 'is_default', $event)"
                      />
                    </q-td>
                  </template>
                  <template #body-cell-icon="props">
                    <q-td :props="props">
                      <q-select
                        dark
                        flat
                        borderless
                        color="amber"
                        :options="issueTypeIcons"
                        :option-label="(item) => item.prefix"
                        :value="getIssueTypeIconById(props.row.icon)"
                        @input="updateIssueType(props.row.id, 'icon', $event)"
                        class="float-right col-3 overflow-hidden"
                      >
                        <template #selected-item="scope">
                          <q-icon
                            size="sm"
                            :name="getIssueTypeIconById(scope.opt.id).prefix"
                            :color="getIssueTypeIconById(scope.opt.id).color"
                          />
                        </template>
                        <template #option="scope">
                          <q-item
                            v-if="!scope.opt.group"
                            v-bind="scope.itemProps"
                            v-on="scope.itemEvents"
                            :clickable="true"
                          >
                            <q-item-section avatar>
                              <q-icon
                                size="sm"
                                :name="scope.opt.prefix"
                                :color="scope.opt.color"
                              />
                            </q-item-section>
                            <q-item-section>
                              {{ scope.opt.prefix }}
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>
                    </q-td>
                  </template>
                  <template #body-cell-id="props">
                    <q-td :props="props">
                      <q-btn
                        flat
                        size="sm"
                        icon="mdi-delete"
                        color="amber"
                        label="Remove"
                        @click="deleteIssueType(props.row.id)"/>
                    </q-td>
                  </template>
                </q-table>
              </template>
              <template #actions>
                <q-input
                  dark
                  flat
                  type="text"
                  label="New Issue Type"
                  color="amber"
                  v-model="newIssueTypeFormData.title"
                  @keyup.enter.native="createIssueType"
                >
                 <template #append>
                   <!-- @Make it disabled if empty -->
                   <q-btn dense
                          rounded
                          flat
                          icon="mdi-keyboard-return"
                          @click="createIssueType"
                   />
                 </template>
                </q-input>
                <p class="text-amber q-pt-sm">* Create new Issue type by typing Title and pressing Enter.
                  You can configure other options after creating</p>
              </template>
            </SettingPanelCard>
          </q-tab-panel>

          <!-- Issue types' icons -->
          <q-tab-panel name="issue_types_icons">
            <SettingPanelCard are-actions>
              <template #section>
                <q-table
                  flat
                  square
                  dark
                  bordered
                  ref="issue_types_icons_table"
                  row-key="prefix"
                  no-data-label="There are no issue types icons in your project"
                  :hide-bottom="true"
                  :data="issueTypeIcons"
                  :columns="issueTypesIconsTableData.columns"
                  :pagination="issueTypesIconsTableData.pagination"
                >
                  <template #body-cell-icon="props">
                    <q-td>
                      <q-icon
                        size="sm"
                        :name="props.row.prefix"
                        :color="props.row.color"
                      />
                    </q-td>
                  </template>
                  <template #body-cell-prefix="props">
                    <q-td :props="props">
                      <q-input
                        dark
                        flat
                        borderless
                        type="text"
                        color="amber"
                        readonly
                        :value="props.row.prefix"
                        :debounce="debounceDefault"
                      />
                    </q-td>
                  </template>
                  <template #body-cell-color="props">
                    <q-td :props="props">
                      <q-input
                        dark
                        flat
                        borderless
                        type="text"
                        color="amber"
                        :value="props.row.color"
                        :debounce="debounceDefault"
                        @input="updateIssueTypeIcon(props.row.id, 'color', $event)"
                      />
                    </q-td>
                  </template>
                  <template #body-cell-id="props">
                    <q-td :props="props">
                      <q-btn
                        flat
                        size="sm"
                        icon="mdi-delete"
                        color="amber"
                        label="Remove"
                        @click="deleteIssueTypeIcon(props.row.id)"/>
                    </q-td>
                  </template>
                </q-table>
              </template>
              <template #actions>
                <q-input
                  dark
                  flat
                  type="text"
                  label="New Issue Types' Icon"
                  color="amber"
                  v-model="newIssueTypeIconFormData.prefix"
                  @keyup.enter.native="createIssueTypeIcon"
                >
                  <template #append>
                    <!-- @Make it disabled if empty -->
                    <q-btn dense
                           rounded
                           flat
                           icon="mdi-keyboard-return"
                           @click="createIssueTypeIcon"
                    />
                  </template>
                </q-input>
                <p class="text-amber q-pt-sm">* Create new Issue type icon by typing prefix and pressing Enter.
                  You can configure other options after creating</p>
              </template>
            </SettingPanelCard>
          </q-tab-panel>

          <q-tab-panel name="issue_states">
            <SettingPanelCard are-actions>
              <template #section>
                <q-table
                  flat
                  square
                  dark
                  bordered
                  ref="issue_states_table"
                  row-key="title"
                  no-data-label="There are no issue states in your project"
                  :hide-bottom="true"
                  :data="issueStates"
                  :columns="issueStatesTableData.columns"
                  :pagination="issueStatesTableData.pagination"
                >
                  <template #body-cell-title="props">
                    <q-td :props="props">
                      <q-input
                        dark
                        flat
                        borderless
                        type="text"
                        color="amber"
                        :value="props.row.title"
                        :debounce="debounceDefault"
                        @input="updateIssueState(props.row.id, 'title', $event)"
                      />
                    </q-td>
                  </template>
                  <template #body-cell-default="props">
                    <q-td :props="props">
                      <q-toggle
                        color="info"
                        :value="props.row.is_default"
                        :debounce="debounceDefault"
                        @input="updateIssueState(props.row.id, 'is_default', $event)"
                      />
                    </q-td>
                  </template>
                  <template #body-cell-done="props">
                    <q-td :props="props">
                      <q-toggle
                        color="info"
                        :value="props.row.is_done"
                        :debounce="debounceDefault"
                        @input="updateIssueState(props.row.id, 'is_done', $event)"
                      />
                    </q-td>
                  </template>
                  <template #body-cell-id="props">
                    <q-td :props="props">
                      <q-btn
                        flat
                        size="sm"
                        icon="mdi-delete"
                        color="amber"
                        label="Remove"
                        @click="deleteIssueState(props.row.id)"/>
                    </q-td>
                  </template>
                </q-table>
              </template>
              <template #actions>
                <q-input
                  dark
                  flat
                  type="text"
                  label="New Issue State"
                  color="amber"
                  v-model="newIssueStateFormData.title"
                  :debounce="debounceDefault"
                  @keyup.enter.native="createIssueState"
                >
                  <template #append>
                    <!-- @Make it disabled if empty -->
                    <q-btn dense
                           rounded
                           flat
                           icon="mdi-keyboard-return"
                           @click="createIssueState"
                    />
                  </template>
                </q-input>
                <p class="text-amber q-pt-sm">* Create new Issue State by typing Title and pressing Enter.
                  You can configure other options after creating</p>
              </template>
            </SettingPanelCard>
          </q-tab-panel>

          <q-tab-panel name="issue_estimations">
            <SettingPanelCard are-actions>
              <template #section>
                <q-table
                  flat
                  square
                  dark
                  bordered
                  ref="issue_types_estimations"
                  row-key="title"
                  no-data-label="There are no issue estimations in your project"
                  :data="issueEstimations"
                  :columns="issueEstimationsTableData.columns"
                  :pagination="issueEstimationsTableData.pagination"
                  :hide-bottom="true"
                >
                  <template #body-cell-title="props">
                    <q-td :props="props">
                      <q-input
                        dark
                        flat
                        borderless
                        type="text"
                        color="amber"
                        :value="props.row.title"
                        :debounce="debounceDefault"
                        @input="updateIssueEstimation(props.row.id, 'title', $event)"
                      />
                    </q-td>
                  </template>
                  <template #body-cell-value="props">
                    <q-td :props="props">
                      <q-input
                        dark
                        flat
                        borderless
                        type="number"
                        color="amber"
                        :value="props.row.value"
                        :debounce="debounceDefault"
                        @input="updateIssueEstimation(props.row.id, 'value', $event)"
                      />
                    </q-td>
                  </template>
                  <template #body-cell-id="props">
                    <q-td :props="props">
                      <q-btn
                        flat
                        size="sm"
                        icon="mdi-delete"
                        color="amber"
                        label="Remove"
                        @click="deleteIssueEstimation(props.row.id)"/>
                    </q-td>
                  </template>
                </q-table>
                <p class="text-amber q-pt-sm">** By changing values you will not affect already calculated
                  Sprint Actual Efforts ( for example: BurnDown Chart)</p>
              </template>
              <template #actions>
                <q-input
                  dark
                  flat
                  type="text"
                  label="New Issue Estimation"
                  color="amber"
                  v-model="newIssueEstimationFormData.title"
                  :debounce="debounceDefault"
                  @keyup.enter.native="createIssueEstimation"
                >
                  <template #append>
                    <!-- @Make it disabled if empty -->
                    <q-btn dense
                           rounded
                           flat
                           icon="mdi-keyboard-return"
                           @click="createIssueEstimation"
                    />
                  </template>
                </q-input>
                <p class="text-amber q-pt-sm">* Create new Issue Estimation by typing Title and pressing Enter.
                  You can configure other options after creating</p>
              </template>
            </SettingPanelCard>
          </q-tab-panel>
        </q-tab-panels>
    </div>
  </q-page>
</template>

<script>
import SettingPanelCard from 'components/elements/SettingPanelCard'
import { Dialogs } from 'pages/mixins/dialogs'
export default {
	name: 'SettingsView',
	components: { SettingPanelCard },
	mixins: [Dialogs],
	data () {
		return {
			tab: 'general',
			debounceDefault: 1000,
			projectFormErrors: {
				title: '',
				key: '',
				owned_by: ''
			},
			issueTypesTableData: {
				columns: [
					{
						label: 'Title',
						name: 'title',
						required: true,
						align: 'left',
						field: row => row.title,
						format: val => `${val}`,
						sortable: true
					},
					{
						label: 'Is Default',
						name: 'default',
						required: true,
						align: 'left',
						field: row => row.is_default,
						format: val => val,
						sortable: true
					},
					{
						label: 'Icon',
						name: 'icon',
						required: true,
						align: 'center',
						field: row => row.icon
					},
					{
						name: 'id',
						required: true,
						align: 'right',
						field: row => row.id,
						format: val => val,
						sortable: true
					}
				],
				pagination: {
					rowsPerPage: 0
				}
			},
			newIssueTypeFormData: {
				title: ''
			},
			issueTypesIconsTableData: {
				columns: [
					{
						name: 'icon',
						required: true,
						align: 'center',
						field: row => row
					},
					{
						label: 'Prefix',
						name: 'prefix',
						required: true,
						align: 'left',
						field: row => row.prefix,
						format: val => `${val}`,
						sortable: true
					},
					{
						label: 'Color',
						name: 'color',
						required: true,
						align: 'left',
						field: row => row.color,
						format: val => val,
						sortable: true
					},
					{
						name: 'id',
						required: true,
						align: 'right',
						field: row => row.id,
						format: val => val,
						sortable: true
					}
				],
				pagination: {
					rowsPerPage: 0
				}
			},
			newIssueTypeIconFormData: {
				prefix: ''
			},
			issueStatesTableData: {
				columns: [
					{
						label: 'Title',
						name: 'title',
						required: true,
						align: 'left',
						field: row => row.title,
						format: val => `${val}`,
						sortable: true
					},
					{
						label: 'Is Default',
						name: 'default',
						required: true,
						align: 'left',
						field: row => row.is_default
					},
					{
						label: 'Is Done',
						name: 'done',
						required: true,
						align: 'left',
						field: row => row.is_done
					},
					{
						name: 'id',
						required: true,
						align: 'right',
						field: row => row.id,
						format: val => val,
						sortable: true
					}
				],
				pagination: {
					rowsPerPage: 0
				}
			},
			newIssueStateFormData: {},
			issueEstimationsTableData: {
				columns: [
					{
						label: 'Title',
						name: 'title',
						required: true,
						align: 'left',
						field: row => row.title,
						format: val => `${val}`,
						sortable: true
					},
					{
						label: 'Value',
						name: 'value',
						required: true,
						align: 'left',
						field: row => row.value,
						style: 'width: 100px;',
						sortable: true
					},
					{
						name: 'id',
						required: true,
						align: 'right',
						field: row => row.id,
						format: val => val,
						sortable: true
					}
				],
				pagination: {
					rowsPerPage: 0
				}
			},
			newIssueEstimationFormData: {
				title: ''
			}
		}
	},
	computed: {
		projectTitle () {
			return this.$store.getters['auth/PROJECT_TITLE']
		},
		projectKey () {
			return this.$store.getters['auth/PROJECT_KEY']
		},
		projectOwnedBy () {
			return this.$store.getters['auth/PROJECT_OWNED_BY']
		},
		participants () {
			return this.$store.getters['auth/PARTICIPANTS_BY_CURRENT_PROJECT']
		},
		issueTypes () {
			return this.$store.getters['core/ISSUE_TYPES_BY_CURRENT_PROJECT']
		},
		issueTypeIcons () {
			return this.$store.getters['core/ISSUE_TYPES_ICONS_BY_CURRENT_PROJECT']
		},
		issueStates () {
			return this.$store.getters['core/ISSUE_STATES_BY_CURRENT_PROJECT']
		},
		issueEstimations () {
			return this.$store.getters['core/ISSUE_ESTIMATIONS_BY_CURRENT_PROJECT']
		}
	},
	mounted () {
		this.$store.dispatch('core/INIT_SPRINT_DURATIONS')
			.catch((e) => {
				console.log(e)
			})
	},
	methods: {
		getIssueTypeIconById (iconId) {
			return this.$store.getters['core/ISSUE_TYPE_ICON_BY_ID'](iconId)
		},
		async updateProject (event, attribute) {
			const payload = {
				id: this.$store.getters['current/PROJECT']
			}

			payload[attribute] = attribute === 'owned_by' ? event.id : event
			try {
				await this.$store.dispatch('auth/UPDATE_PROJECT', payload)
			} catch (e) {
				this.showError(e)
			}
		},
		async deleteProject () {
			const payload = {
				id: this.$store.getters['current/PROJECT'],
				workspace: this.$store.getters['auth/WORKSPACE_ID']
			}

			const dialog = [
				'Do you want to remove project?',
				'All information in project will be deleted',
				'Remove',
				'danger'
			]

			try {
				this.showOkCancelDialog(...dialog)
					.onOk(r => {
						this.$store.dispatch('auth/DELETE_PROJECT', payload)
						this.$router.push({ name: 'loading' })
					})
			} catch (e) {
				this.showError(e)
			}
		},
		async updateIssueType (id, attribute, value) {
			const payload = {
				id: id
			}

			payload[attribute] = attribute === 'icon' ? value.id : value

			try {
				await this.$store.dispatch('core/UPDATE_ISSUE_TYPE_CATEGORY', payload)
			} catch (e) {
				this.showError(e)
			}
		},
		async createIssueType () {
			const payload = {
				workspace: this.$store.getters['auth/WORKSPACE_ID'],
				project: this.$store.getters['current/PROJECT'],
				title: this.newIssueTypeFormData.title,
				icon: null
			}

			try {
				await this.$store.dispatch('core/ADD_ISSUE_TYPE_CATEGORY', payload)
				this.newIssueTypeFormData.title = ''
			} catch (e) {
				this.showError(e)
			}
		},
		async deleteIssueType (id) {
			const payload = {
				id: id
			}

			try {
				await this.$store.dispatch('core/DELETE_ISSUE_TYPE_CATEGORY', payload)
			} catch (e) {
				this.showError(e)
			}
		},
		async updateIssueTypeIcon (id, attribute, value) {
			const payload = {
				id: id
			}

			payload[attribute] = value

			try {
				await this.$store.dispatch('core/UPDATE_ISSUE_TYPE_ICON_CATEGORY', payload)
			} catch (e) {
				this.showError(e)
			}
		},
		async createIssueTypeIcon () {
			const payload = {
				workspace: this.$store.getters['auth/WORKSPACE_ID'],
				project: this.$store.getters['current/PROJECT'],
				prefix: `mdi-${this.newIssueTypeIconFormData.prefix}`,
				color: 'grey-12'
			}

			try {
				await this.$store.dispatch('core/ADD_ISSUE_TYPE_ICON_CATEGORY', payload)
				this.newIssueTypeIconFormData.prefix = ''
			} catch (e) {
				this.showError(e)
			}
		},
		async deleteIssueTypeIcon (id) {
			const payload = {
				id: id
			}

			try {
				await this.$store.dispatch('core/DELETE_ISSUE_TYPE_ICON_CATEGORY', payload)
			} catch (e) {
				this.showError(e)
			}
		},
		async updateIssueState (id, attribute, value) {
			const payload = {
				id: id
			}

			payload[attribute] = value

			try {
				await this.$store.dispatch('core/UPDATE_ISSUE_STATE_CATEGORY', payload)
			} catch (e) {
				this.showError(e)
			}
		},
		async createIssueState () {
			const payload = {
				workspace: this.$store.getters['auth/WORKSPACE_ID'],
				project: this.$store.getters['current/PROJECT'],
				title: this.newIssueStateFormData.title
			}

			try {
				await this.$store.dispatch('core/ADD_ISSUE_STATE_CATEGORY', payload)
				this.newIssueStateFormData.title = ''
			} catch (e) {
				this.showError(e)
			}
		},
		async deleteIssueState (id) {
			const payload = {
				id: id
			}

			try {
				await this.$store.dispatch('core/DELETE_ISSUE_STATE_CATEGORY', payload)
			} catch (e) {
				this.showError(e)
			}
		},
		async updateIssueEstimation (id, attribute, value) {
			const payload = {
				id: id
			}

			payload[attribute] = value

			try {
				await this.$store.dispatch('core/UPDATE_ISSUE_ESTIMATION_CATEGORY', payload)
			} catch (e) {
				this.showError(e)
			}
		},
		async createIssueEstimation () {
			const payload = {
				workspace: this.$store.getters['auth/WORKSPACE_ID'],
				project: this.$store.getters['current/PROJECT'],
				title: this.newIssueEstimationFormData.title,
				value: 0
			}

			try {
				await this.$store.dispatch('core/ADD_ISSUE_ESTIMATION_CATEGORY', payload)
				this.newIssueEstimationFormData.title = ''
			} catch (e) {
				this.showError(e)
			}
		},
		async deleteIssueEstimation (id) {
			const payload = {
				id: id
			}

			try {
				await this.$store.dispatch('core/DELETE_ISSUE_ESTIMATION_CATEGORY', payload)
			} catch (e) {
				this.showError(e)
			}
		}
	}
}
</script>
