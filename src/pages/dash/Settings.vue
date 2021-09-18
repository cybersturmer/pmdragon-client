<template>
  <q-page class="flex q-layout-padding">
    <div class="full-width">
        <q-tabs
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
        <q-separator />
        <q-tab-panels
          style="border: 1px solid #777"
          v-model="tab"
          animated
          transition-next="fade"
          transition-prev="fade">
          <q-tab-panel name="general" class="no-scroll">
            <SettingPanelCard
							are-actions
							:defaultPreText="`* All changes will take effect ${ debounceInSeconds } second after input value`">
              <template #section>
                <q-input
                  flat
                  type="text"
                  label="Project name"
                  :modelValue="projectTitle"
									@update:modelValue="updateProjectEvent($event, 'title')"
									:debounce="debounceDefault"
								/>
                <q-input
                  flat
                  type="text"
                  label="Project key"
                  :modelValue="projectKey"
									@update:modelValue="updateProjectEvent($event, 'key')"
									:debounce="debounceDefault"
                />
                <q-select
                  flat
                  label="Project owner"
                  :modelValue="projectOwnedBy"
									@update:modelValue="updateProjectEvent($event, 'owned_by')"
									:options="participants"
									:option-label="(item) => `${item.first_name} ${item.last_name}`"
									hint="Right after changing it you will not be able anymore to change the project."
                />
              </template>
              <template #actions>
                <q-btn-group>
                  <q-btn
                    color="negative"
                    label="Remove project"
                    icon="mdi-delete"
                    @click="deleteProjectEvent"/>
                </q-btn-group>
                <p class="text-secondary q-pt-sm">* By clicking it you will delete this project with all its issues,
                  issue types, issue states, issue estimations</p>
              </template>
            </SettingPanelCard>
          </q-tab-panel>

          <q-tab-panel name="issue_types" class="no-scroll">
            <SettingPanelCard
							are-actions
							:defaultPreText="`* All changes will take effect ${ debounceInSeconds } second after input value`">
              <template #section>
                <q-table
                  flat
                  square
                  bordered
                  ref="issue_types_table"
                  row-key="title"
                  no-data-label="There are no issue types in your project"
                  :hide-bottom="true"
                  :rows="issueTypes"
                  :columns="issueTypesTableData.columns"
                  :pagination="issueTypesTableData.pagination"
                >
                  <template #body-cell-title="props">
                    <q-td :props="props">
                      <q-input
                        flat
                        borderless
                        type="text"
                        color="secondary"
                        :modelValue="props.row.title"
												@update:modelValue="updateIssueType(props.row.id, 'title', $event)"
												:debounce="debounceDefault"
                      />
                    </q-td>
                  </template>
                  <template #body-cell-default="props">
                    <q-td :props="props">
                      <q-toggle
                        color="info"
                        :modelValue="props.row.is_default"
                        @update:modelValue="updateIssueType(props.row.id, 'is_default', $event)"
                      />
                    </q-td>
                  </template>
                  <template #body-cell-icon="props">
                    <q-td :props="props">
                      <q-select
                        flat
                        borderless
                        color="secondary"
                        :options="issueTypeIcons"
                        :option-label="(item) => item.prefix"
                        :modelValue="getIssueTypeIconById(props.row.icon)"
                        @update:modelValue="updateIssueType(props.row.id, 'icon', $event)"
                        class="float-right col-3 overflow-hidden"
                      >
                        <template #selected-item="scope">
                          <q-icon
														size="md"
														:name="getIssueTypeIconById(scope.opt.id).prefix"
														:style="`color: ${scope.opt.color}`"
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
																:style="`color: ${scope.opt.color}`"
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
                        icon="mdi-delete"
                        color="negative"
												:label="$q.screen.gt.sm ? 'Remove' :  '' "
                        @click="deleteIssueType(props.row.id)"/>
                    </q-td>
                  </template>
                </q-table>
              </template>
              <template #actions>
                <q-input
                  flat
                  type="text"
                  label="New Issue Type"
                  color="secondary"
                  v-model="newIssueTypeFormData.title"
                  @keyup.enter="createIssueType"
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
                <p class="text-secondary q-pt-sm">* Create new Issue type by typing Title and pressing Enter.
                  You can configure other options after creating</p>
              </template>
            </SettingPanelCard>
          </q-tab-panel>

          <!-- Issue types' icons -->
          <q-tab-panel name="issue_types_icons" class="no-scroll">
            <SettingPanelCard
							are-actions
							:defaultPreText="`* All changes will take effect ${ debounceInSeconds } second after input value`">
              <template #section>
                <q-table
                  flat
                  square
                  bordered
                  ref="issue_types_icons_table"
                  row-key="prefix"
                  no-data-label="There are no issue types icons in your project"
                  :hide-bottom="true"
                  :rows="issueTypeIcons"
                  :columns="issueTypesIconsTableData.columns"
                  :pagination="issueTypesIconsTableData.pagination"
                >
                  <template #body-cell-icon="props">
                    <q-td>
                      <q-icon
												size="md"
												:style="`color: ${props.row.color}`"
                        :name="props.row.prefix"/>
                    </q-td>
                  </template>
                  <template #body-cell-prefix="props">
                    <q-td :props="props">
											<q-btn
												flat
												icon="mdi-tooltip-image">
														<q-popup-proxy transition-show="scale" transition-hide="scale">
															<div style="width: 200px;">
																<q-input :modelValue="iconPickerFilter"
																				 @update:modelValue="inputIconPickerFilter"
																				 flat
																				 type="text"
																				 label="Filter"
																				 label-color="secondary"
																				 clearable
																				 class="q-pa-sm" />
																<QIconPicker
																	:modelValue="props.row.prefix"
																	@update:modelValue="updateIssueTypeIcon(props.row.id, 'prefix', $event)"
																	dense
																	icon-set="mdi-v5"
																	:filter="iconPickerFilter"
																	v-model:model-pagination="iconPickerPagination"
																	:paginationProps="{
																		maxPages: 2,
																		input: true,
																		color: iconPickerPaginationColor,
																		'input-class': 'text-white text-weight-bold'
																	}"
																	font-size="16px"
																	style="height: 200px; width: 200px">
																</QIconPicker>
															</div>
														</q-popup-proxy>
													</q-btn>
                    </q-td>
                  </template>
                  <template #body-cell-color="props">
                    <q-td :props="props" class="col-4">
                      <q-input
												v-if="$q.screen.gt.md"
												readonly
                        flat
                        borderless
                        type="text"
                        color="secondary"
                        :modelValue="props.row.color"
												@update:modelValue="updateIssueTypeIcon(props.row.id, 'color', $event)"
												:debounce="debounceDefault"
											>
												<template #prepend>
													<q-icon name="mdi-palette" class="cursor-pointer">
														<q-popup-proxy transition-show="scale" transition-hide="scale">
															<q-color format-model="hex"
																			 :modelValue="props.row.color"
																			 @update:modelValue="updateIssueTypeIcon(props.row.id, 'color', $event)"
																			 :debounce="debounceDefault"
															/>
														</q-popup-proxy>
													</q-icon>
												</template>
											</q-input>
											<q-btn
												v-else
												flat
												icon="mdi-palette">
												<q-popup-proxy transition-show="scale" transition-hide="scale">
													<q-color format-model="hex"
																	 :modelValue="props.row.color"
																	 @update:modelValue="updateIssueTypeIcon(props.row.id, 'color', $event)"
																	 :debounce="debounceDefault"
													/>
												</q-popup-proxy>
											</q-btn>
                    </q-td>
                  </template>
                  <template #body-cell-id="props">
                    <q-td :props="props">
                      <q-btn
												:label="$q.screen.gt.sm ? 'Remove' :  '' "
												icon="mdi-delete"
												color="negative"
                        @click="deleteIssueTypeIcon(props.row.id)"/>
                    </q-td>
                  </template>
                </q-table>
              </template>
              <template #actions>
                <q-input
                  flat
                  type="text"
                  label="New Issue Types' Icon"
                  color="secondary"
                  v-model="newIssueTypeIconFormData.prefix"
                  @keyup.enter="createIssueTypeIcon"
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
                <p class="text-secondary q-pt-sm">* Create new Issue type icon by typing prefix and pressing Enter.
                  You can configure other options after creating</p>
              </template>
            </SettingPanelCard>
          </q-tab-panel>

          <q-tab-panel name="issue_states" class="no-scroll">
            <SettingPanelCard
							are-actions
							:defaultPreText="`* All changes will take effect ${ debounceInSeconds } second after input value`">
              <template #section>
                <q-table
                  flat
                  square
                  bordered
                  ref="issue_states_table"
                  row-key="title"
                  no-data-label="There are no issue states in your project"
                  :hide-bottom="true"
                  :rows="issueStates"
                  :columns="issueStatesTableData.columns"
                  :pagination="issueStatesTableData.pagination"
                >
                  <template #body-cell-title="props">
                    <q-td :props="props">
                      <q-input
                        flat
                        borderless
                        type="text"
                        color="secondary"
                        :modelValue="props.row.title"
												@update:modelValue="updateIssueState(props.row.id, 'title', $event)"
												:debounce="debounceDefault"
                      />
                    </q-td>
                  </template>
                  <template #body-cell-default="props">
                    <q-td :props="props">
                      <q-toggle
                        color="info"
                        :modelValue="props.row.is_default"
												@update:modelValue="updateIssueState(props.row.id, 'is_default', $event)"
												:debounce="debounceDefault"
                      />
                    </q-td>
                  </template>
                  <template #body-cell-done="props">
                    <q-td :props="props">
                      <q-toggle
                        color="info"
                        :modelValue="props.row.is_done"
												@update:modelValue="updateIssueState(props.row.id, 'is_done', $event)"
												:debounce="debounceDefault"
                      />
                    </q-td>
                  </template>
									<template #body-cell-ordering="props">
										<q-td :props="props">
											<q-input
												flat
												borderless
												type="text"
												color="secondary"
												class="text-center"
												input-style="width: 30px; text-align: center"
												:modelValue="props.row.ordering"
												@update:modelValue="updateIssueState(props.row.id, 'ordering', $event)"
												:debounce="debounceDefault"
											/>
										</q-td>
									</template>
                  <template #body-cell-id="props">
                    <q-td :props="props">
                      <q-btn
												:label="$q.screen.gt.sm ? 'Remove' :  '' "
                        icon="mdi-delete"
                        color="negative"
                        @click="deleteIssueState(props.row.id)"/>
                    </q-td>
                  </template>
                </q-table>
              </template>
              <template #actions>
                <q-input
                  flat
                  type="text"
                  label="New Issue State"
                  color="secondary"
                  v-model="newIssueStateFormData.title"
                  :debounce="debounceDefault"
                  @keyup.enter="createIssueState"
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
                <p class="text-secondary q-pt-sm">* Create new Issue State by typing Title and pressing Enter.
                  You can configure other options after creating</p>
              </template>
            </SettingPanelCard>
          </q-tab-panel>

          <q-tab-panel name="issue_estimations" class="no-scroll">
            <SettingPanelCard
							are-actions
							:defaultPreText="`* All changes will take effect ${ debounceInSeconds } second after input value`">
              <template #section>
                <q-table
                  flat
                  square
                  bordered
                  ref="issue_types_estimations"
                  row-key="title"
                  no-data-label="There are no issue estimations in your project"
                  :rows="issueEstimations"
                  :columns="issueEstimationsTableData.columns"
                  :pagination="issueEstimationsTableData.pagination"
                  :hide-bottom="true"
                >
                  <template #body-cell-title="props">
                    <q-td :props="props">
                      <q-input
                        flat
                        borderless
                        type="text"
                        color="secondary"
                        :modelValue="props.row.title"
												@update:modelValue="updateIssueEstimation(props.row.id, 'title', $event)"
												:debounce="debounceDefault"
                      />
                    </q-td>
                  </template>
                  <template #body-cell-value="props">
                    <q-td :props="props">
                      <q-input
                        flat
                        borderless
                        type="number"
                        color="secondary"
												input-style="width: 60px; text-align: center"
                        :modelValue="props.row.value"
												@update:modelValue="updateIssueEstimation(props.row.id, 'value', $event)"
												:debounce="debounceDefault"
                      />
                    </q-td>
                  </template>
                  <template #body-cell-id="props">
                    <q-td :props="props">
                      <q-btn
												:label="$q.screen.gt.sm ? 'Remove' :  '' "
                        icon="mdi-delete"
                        color="negative"
                        @click="deleteIssueEstimation(props.row.id)"/>
                    </q-td>
                  </template>
                </q-table>
                <p class="text-secondary q-pt-sm">** By changing values you will not affect already calculated
                  Sprint Actual Efforts ( for example: BurnDown Chart)</p>
              </template>
              <template #actions>
                <q-input
                  flat
                  type="text"
                  label="New Issue Estimation"
                  color="secondary"
                  v-model="newIssueEstimationFormData.title"
                  :debounce="debounceDefault"
                  @keyup.enter="createIssueEstimation"
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
                <p class="text-secondary q-pt-sm">* Create new Issue Estimation by typing Title and pressing Enter.
                  You can configure other options after creating</p>
              </template>
            </SettingPanelCard>
          </q-tab-panel>
        </q-tab-panels>
    </div>
  </q-page>
</template>

<script>
import '@quasar/quasar-ui-qiconpicker/dist/index.css'
import '@quasar/quasar-ui-qiconpicker/dist/icon-set/mdi-v5.umd.js'
import { defineComponent } from 'vue'
import SettingPanelCard from 'src/components/elements/SettingPanelCard'
import { Dialogs } from 'src/pages/mixins/dialogs'
import { loading } from 'src/pages/mixins/loading'
import { debounce } from 'quasar'
import { QIconPicker } from '@quasar/quasar-ui-qiconpicker'
import { isEmptyString } from 'src/services/util'
import { CoreActionsMixin } from 'src/services/actions/core'
import { AuthActionsMixin } from 'src/services/actions/auth'

export default defineComponent({
	name: 'SettingsView',
	components: {
		QIconPicker,
		SettingPanelCard
	},
	mixins: [
		Dialogs,
		AuthActionsMixin,
		CoreActionsMixin,
		loading
	],
	data () {
		return {
			tab: 'general',
			debounceDefault: 1000,
			iconPickerFilter: '',
			iconPickerPagination: {
				itemsPerPage: 30,
				page: 0
			},
			iconPickerPaginationColor: 'white',
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
						label: 'Preview',
						name: 'icon',
						required: true,
						align: 'left',
						field: row => row
					},
					{
						label: 'Icon',
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
						label: '#',
						name: 'ordering',
						align: 'left',
						required: true,
						field: row => row.ordering,
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
		},
		debounceInSeconds () {
			return Math.trunc(this.debounceDefault / 1000)
		}
	},
	created () {
		// Let's debounce choosing color or icon
		this.updateIssueTypeIcon = debounce(this.updateIssueTypeIcon, this.debounceDefault)
	},
	mounted () {
		this.getSprintDurations()
	},
	methods: {
		inputIconPickerFilter (value) {
			this.iconPickerFilter = value.toLowerCase()
		},
		getIssueTypeIconById (iconId) {
			return this.$store.getters['core/ISSUE_TYPE_ICON_BY_ID'](iconId)
		},
		async updateProjectEvent (event, attribute) {
			this.showProgress()

			const payload = {
				id: this.$store.getters['current/PROJECT']
			}

			payload[attribute] = attribute === 'owned_by' ? event.id : event
			try {
				await this.updateProject(payload)
			} catch (e) {
				this.showError(e)
			} finally {
				this.hideProgress()
			}
		},
		async deleteProjectEvent () {
			this.showProgress()

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
						this.deleteProject(payload)
							.then(() => this.$router.push({ name: 'loading' }))
					})
			} catch (e) {
				this.showError(e)
			} finally {
				this.hideProgress()
			}
		},
		async updateIssueType (id, attribute, value) {
			if (isEmptyString(value)) return false

			this.showProgress()

			const payload = {
				id: id
			}

			payload[attribute] = attribute === 'icon' ? value.id : value

			try {
				await this.updateIssueTypeCategory(payload)
			} catch (e) {
				this.showError(e)
			} finally {
				this.hideProgress()
			}
		},
		async createIssueType () {
			if (isEmptyString(this.newIssueTypeFormData.title)) return false

			this.showProgress()

			const payload = {
				workspace: this.$store.getters['auth/WORKSPACE_ID'],
				project: this.$store.getters['current/PROJECT'],
				title: this.newIssueTypeFormData.title,
				icon: null
			}

			try {
				await this.addIssueTypeCategory(payload)
				this.newIssueTypeFormData.title = ''
			} catch (e) {
				this.showError(e)
			} finally {
				this.hideProgress()
			}
		},
		async deleteIssueType (id) {
			this.showProgress()

			const payload = {
				id: id
			}

			try {
				await this.deleteIssueTypeCategory(payload)
			} catch (e) {
				this.showError(e)
			} finally {
				this.hideProgress()
			}
		},
		async updateIssueTypeIcon (id, attribute, value) {
			if (isEmptyString(value)) return false

			if (attribute === 'prefix') {
				this.iconPickerFilter = ''
			}

			this.showProgress()

			const payload = {
				id: id
			}

			payload[attribute] = value

			try {
				await this.updateIssueTypeIconCategory(payload)
			} catch (e) {
				this.showError(e)
			} finally {
				this.hideProgress()
			}
		},
		async createIssueTypeIcon () {
			if (isEmptyString(this.newIssueTypeIconFormData.prefix)) return false

			this.showProgress()
			const payload = {
				workspace: this.$store.getters['auth/WORKSPACE_ID'],
				project: this.$store.getters['current/PROJECT'],
				prefix: `mdi-${this.newIssueTypeIconFormData.prefix}`,
				color: 'grey-12'
			}

			try {
				await this.addIssueTypeIconCategory(payload)
				this.newIssueTypeIconFormData.prefix = ''
			} catch (e) {
				this.showError(e)
			} finally {
				this.hideProgress()
			}
		},
		async deleteIssueTypeIcon (id) {
			this.showProgress()
			const payload = {
				id: id
			}

			try {
				await this.deleteIssueTypeIconCategory(payload)
			} catch (e) {
				this.showError(e)
			} finally {
				this.hideProgress()
			}
		},
		async updateIssueState (id, attribute, value) {
			if (isEmptyString(value)) return false

			this.showProgress()
			const payload = {
				id: id
			}

			payload[attribute] = value

			try {
				await this.updateIssueStateCategory(payload)
			} catch (e) {
				this.showError(e)
			} finally {
				this.hideProgress()
			}
		},
		async createIssueState () {
			if (isEmptyString(this.newIssueStateFormData.title)) return false

			const payload = {
				workspace: this.$store.getters['auth/WORKSPACE_ID'],
				project: this.$store.getters['current/PROJECT'],
				title: this.newIssueStateFormData.title
			}

			try {
				await this.addIssueStateCategory(payload)
				this.newIssueStateFormData.title = ''
			} catch (e) {
				this.showError(e)
			} finally {
				this.hideProgress()
			}
		},
		async deleteIssueState (id) {
			this.showProgress()
			const payload = {
				id: id
			}

			try {
				await this.deleteIssueStateCategory(payload)
			} catch (e) {
				this.showError(e)
			} finally {
				this.hideProgress()
			}
		},
		async updateIssueEstimation (id, attribute, value) {
			if (isEmptyString(value)) return false

			this.showProgress()
			const payload = {
				id: id
			}

			payload[attribute] = value

			try {
				await this.updateIssueEstimationCategory(payload)
			} catch (e) {
				this.showError(e)
			} finally {
				this.hideProgress()
			}
		},
		async createIssueEstimation () {
			if (isEmptyString(this.newIssueEstimationFormData.title)) return false

			this.showProgress()
			const payload = {
				workspace: this.$store.getters['auth/WORKSPACE_ID'],
				project: this.$store.getters['current/PROJECT'],
				title: this.newIssueEstimationFormData.title,
				value: 0
			}

			try {
				await this.addIssueEstimationCategory(payload)
				this.newIssueEstimationFormData.title = ''
			} catch (e) {
				this.showError(e)
			} finally {
				this.hideProgress()
			}
		},
		async deleteIssueEstimation (id) {
			this.showProgress()
			const payload = {
				id: id
			}

			try {
				await this.deleteIssueEstimationCategory(payload)
			} catch (e) {
				this.showError(e)
			} finally {
				this.hideProgress()
			}
		}
	}
})
</script>
