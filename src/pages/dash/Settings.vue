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
					<q-tab name="working_weekdays" icon="mdi-timetable" label="Working Weekdays" />
					<q-tab name="non_working_days" icon="mdi-timetable" label="Non Working Days" />
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
									@update:modelValue="updateProjectHandler($event, 'title')"
									:debounce="debounceDefault"
								/>
                <q-input
                  flat
                  type="text"
                  label="Project key"
                  :modelValue="projectKey"
									@update:modelValue="updateProjectHandler($event, 'key')"
									:debounce="debounceDefault"
                />
                <q-select
                  flat
                  label="Project owner"
                  :modelValue="projectOwnedBy"
									@update:modelValue="updateProjectHandler($event, 'owned_by')"
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
                    @click="deleteProjectHandler"/>
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
												@update:modelValue="updateIssueTypeHandler(props.row.id, 'title', $event)"
												:debounce="debounceDefault"
                      />
                    </q-td>
                  </template>
                  <template #body-cell-default="props">
                    <q-td :props="props">
                      <q-toggle
                        color="info"
                        :modelValue="props.row.is_default"
                        @update:modelValue="updateIssueTypeHandler(props.row.id, 'is_default', $event)"
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
                        @update:modelValue="updateIssueTypeHandler(props.row.id, 'icon', $event)"
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
                        @click="deleteIssueTypeHandler(props.row.id)"/>
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
                  @keyup.enter="createIssueTypeHandler"
                >
                 <template #append>
                   <!-- @Make it disabled if empty -->
                   <q-btn dense
                          rounded
                          flat
                          icon="mdi-keyboard-return"
                          @click="createIssueTypeHandler"
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
																	@update:modelValue="updateIssueTypeIconHandler(props.row.id, 'prefix', $event)"
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
												@update:modelValue="updateIssueTypeIconHandler(props.row.id, 'color', $event)"
												:debounce="debounceDefault"
											>
												<template #prepend>
													<q-icon name="mdi-palette" class="cursor-pointer">
														<q-popup-proxy transition-show="scale" transition-hide="scale">
															<q-color format-model="hex"
																			 :modelValue="props.row.color"
																			 @update:modelValue="updateIssueTypeIconHandler(props.row.id, 'color', $event)"
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
																	 @update:modelValue="updateIssueTypeIconHandler(props.row.id, 'color', $event)"
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
                        @click="deleteIssueTypeIconHandler(props.row.id)"/>
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
                  @keyup.enter="createIssueTypeIconHandler"
                >
                  <template #append>
                    <!-- @Make it disabled if empty -->
                    <q-btn dense
                           rounded
                           flat
                           icon="mdi-keyboard-return"
                           @click="createIssueTypeIconHandler"
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
												@update:modelValue="updateIssueStateHandler(props.row.id, 'title', $event)"
												:debounce="debounceDefault"
                      />
                    </q-td>
                  </template>
                  <template #body-cell-default="props">
                    <q-td :props="props">
                      <q-toggle
                        color="info"
                        :modelValue="props.row.is_default"
												@update:modelValue="updateIssueStateHandler(props.row.id, 'is_default', $event)"
												:debounce="debounceDefault"
                      />
                    </q-td>
                  </template>
                  <template #body-cell-done="props">
                    <q-td :props="props">
                      <q-toggle
                        color="info"
                        :modelValue="props.row.is_done"
												@update:modelValue="updateIssueStateHandler(props.row.id, 'is_done', $event)"
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
												@update:modelValue="updateIssueStateHandler(props.row.id, 'ordering', $event)"
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
                        @click="deleteIssueStateHandler(props.row.id)"/>
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
                  @keyup.enter="createIssueStateHandler"
                >
                  <template #append>
                    <!-- @Make it disabled if empty -->
                    <q-btn dense
                           rounded
                           flat
                           icon="mdi-keyboard-return"
                           @click="createIssueStateHandler"
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
												@update:modelValue="updateIssueEstimationHandler(props.row.id, 'title', $event)"
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
												@update:modelValue="updateIssueEstimationHandler(props.row.id, 'value', $event)"
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
                        @click="deleteIssueEstimationHandler(props.row.id)"/>
                    </q-td>
                  </template>
                </q-table>
                <p class="text-secondary q-pt-sm q-pb-none q-mb-none">** Value is equal to SP, we use it to calculate capacity and
									track progress</p>
								<p class="text-secondary">*** By changing values you will not affect already calculated
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
                  @keyup.enter="createIssueEstimationHandler"
                >
                  <template #append>
                    <!-- @Make it disabled if empty -->
                    <q-btn dense
                           rounded
                           flat
                           icon="mdi-keyboard-return"
                           @click="createIssueEstimationHandler"
                    />
                  </template>
                </q-input>
                <p class="text-secondary q-pt-sm">* Create new Issue Estimation by typing Title and pressing Enter.
                  You can configure other options after creating</p>
              </template>
            </SettingPanelCard>
          </q-tab-panel>
					<q-tab-panel name="working_weekdays" class="no-scroll">
						<SettingPanelCard
							defaultPreText="* All changes will take effect right after click">
							<template #section>
								<div class="rounded-borders q-pa-md">
									<div
									v-for="weekday in weekdays"
									:key="weekday"
									class="row q-pa-xs">
										<div class="col col-md-4">{{ weekday }}</div>
										<div class="col col-auto">
											<q-btn-toggle
												color="info"
												no-caps
												:options="workingNonWorkingOptions"
												:modelValue="workingDays[weekday.toLowerCase()]"
												@update:modelValue="updateWorkingDaysHandler(workingDays.id, weekday.toLowerCase(), $event)"
											/>
										</div>
									</div>
								</div>
							</template>
						</SettingPanelCard>
					</q-tab-panel>
					<q-tab-panel name="non_working_days" class="no-scroll">
						<SettingPanelCard
							defaultPreText="* All changes will take effect right after click">
							<template #section>
								<div class="row">
									<div class="col-md-6">
										<q-date
											flat
											landscape
											today-btn
											minimal
											multiple
											mask="YYYY-MM-DD"
											@update:modelValue="nonWorkingDayHandler"
											:modelValue="newNonWorkingDay"
											default-view="Calendar"
											event-color="accent"
											:events="nonWorkingDaysDates"/>
									</div>
									<div class="col-md-6">
										<q-chip
											v-for="nonWorkingDay in nonWorkingDays"
											:key="nonWorkingDay.id"
											removable
											icon="mdi-calendar-today"
											@remove="deleteNonWorkingDayHandler(nonWorkingDay)"
										>
											{{ nonWorkingDay.date }}
										</q-chip>
									</div>
								</div>
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
			workingNonWorkingOptions: [{
				label: 'Working',
				value: true
			},
			{
				label: 'Non-working',
				value: false
			}],
			newNonWorkingDay: new Date().toISOString().substring(0, 10),
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
						label: 'Points',
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
		workingDays () {
			return this.$store.getters['core/WORKING_DAYS_BY_CURRENT_PROJECT']
		},
		debounceInSeconds () {
			return Math.trunc(this.debounceDefault / 1000)
		},
		weekdays () {
			return this.$moment.weekdays()
		},
		nonWorkingDays () {
			return this.$store.getters['core/NON_WORKING_DAYS_BY_IDS'](this.workingDays.non_working_days)
		},
		nonWorkingDaysDates () {
			return this.nonWorkingDays.map(value => value.date.replaceAll('-', '/'))
		}
	},
	created () {
		// Let's debounce choosing color or icon
		this.updateIssueTypeIconHandler = debounce(this.updateIssueTypeIconHandler, this.debounceDefault)
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
		async updateProjectHandler (event, attribute) {
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
		async deleteProjectHandler () {
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
		async updateIssueTypeHandler (id, attribute, value) {
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
		async createIssueTypeHandler () {
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
		async deleteIssueTypeHandler (id) {
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
		async updateIssueTypeIconHandler (id, attribute, value) {
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
		async createIssueTypeIconHandler () {
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
		async deleteIssueTypeIconHandler (id) {
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
		async updateIssueStateHandler (id, attribute, value) {
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
		async createIssueStateHandler () {
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
		async deleteIssueStateHandler (id) {
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
		async updateIssueEstimationHandler (id, attribute, value) {
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
		async createIssueEstimationHandler () {
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
		async deleteIssueEstimationHandler (id) {
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
		},
		async nonWorkingDayHandler (value, reason, details) {
			switch (reason) {
			case 'add-day':
				await this.addNonWorkingDayHandler(value[1])
				break
			default:
				throw new Error()
			}
			console.dir(value)
			console.dir(reason)
			console.dir(details)
		},
		async addNonWorkingDayHandler (date) {
			const nonWorkingDayPayload = {
				workspace: this.$store.getters['auth/WORKSPACE_ID'],
				project: this.$store.getters['current/PROJECT'],
				date: date
			}

			this.showProgress()

			try {
				const nonWorkingDay = await this.addNonWorkingDay(nonWorkingDayPayload)

				const workingDaysSetting = this.$store.getters['core/WORKING_DAYS_BY_CURRENT_PROJECT']

				const workingDaysPayload = {
					id: workingDaysSetting.id,
					non_working_days: [...workingDaysSetting.non_working_days, nonWorkingDay.data.id]
				}

				await this.updateWorkingDays(workingDaysPayload)
			} catch (e) {
				this.showError(e)
			} finally {
				this.hideProgress()
			}
		},
		async deleteNonWorkingDayHandler (payload) {
			this.showProgress()

			try {
				await this.deleteNonWorkingDay(payload)
			} catch (e) {
				this.showError(e)
			} finally {
				this.hideProgress()
			}
		},
		async updateWorkingDaysHandler (id, attribute, value) {
			if (isEmptyString(value) || !id) return false

			const payload = {
				id: id
			}

			payload[attribute] = value

			this.showProgress()

			try {
				await this.updateWorkingDays(payload)
			} catch (e) {
				this.showError(e)
			} finally {
				this.hideProgress()
			}
		}
	}
})
</script>
