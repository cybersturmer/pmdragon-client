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
          <q-tab name="general" icon="stars" label="General"/>
          <q-tab name="issue_types" icon="receipt" label="Issue Types" />
          <q-tab name="issue_states" icon="schema" label="Issue States" />
          <q-tab name="issue_estimations" icon="how_to_vote" label="Issue Estimations" />
        </q-tabs>
        <q-separator dark/>
        <q-tab-panels class="bg-primary" style="border: 1px solid #777" v-model="tab" animated>
          <q-tab-panel name="general">
            <SettingPanelCard are-actions>
              <template #section>
                <q-input
                  dark
                  flat
                  type="text"
                  label="Project name"
                  color="amber"
                  :value="projectName"
                />
                <q-input
                  dark
                  flat
                  type="text"
                  label="Project key"
                  color="amber"
                  :value="projectKey"
                />
                <q-select
                  dark
                  flat
                  label="Project owner"
                  :value="projectOwnedBy"
                  :options="participants"
                  :option-label="(item) => `${item.first_name} ${item.last_name}`"
                />
              </template>
              <template #actions>
                <q-btn-group>
                  <q-btn
                    color="red-14"
                    label="Remove project"/>
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
                  dense
                  bordered
                  ref="issue_types_table"
                  row-key="title"
                  no-data-label="There are no issue types in your project"
                  :hide-bottom="true"
                  :data="issueTypes"
                  :columns="issueTypesTableData.columns"
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
                      />
                    </q-td>
                  </template>
                  <template #body-cell-default="props">
                    <q-td :props="props">
                      <q-toggle
                        :value="props.row.is_default"
                        color="info"
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
                        :value="props.row.icon"
                        class="float-right col-3 overflow-hidden"
                      >
                        <template #selected-item="scope">
                          <q-icon
                            size="sm"
                            :name="scope.opt.prefix"
                            :color="scope.opt.color"
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
                </q-table>
              </template>
              <template #actions>
                <q-input
                  dark
                  flat
                  type="text"
                  label="New Issue Type"
                  color="amber"
                  v-model="newIssueTypeFormData.title">
                 <template #append>
                   <!-- @Make it disabled if empty -->
                   <q-btn dense
                          rounded
                          flat
                          icon="keyboard_return"/>
                 </template>
                </q-input>
                <p class="text-amber q-pt-sm">* Create new Issue type by typing and pressing Enter.
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
                  dense
                  bordered
                  ref="issue_types_table"
                  row-key="title"
                  no-data-label="There are no issue types in your project"
                  :hide-bottom="true"
                  :data="issueStates"
                  :columns="issueStatesTableData.columns"
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
                      />
                    </q-td>
                  </template>
                  <template #body-cell-default="props">
                    <q-td :props="props">
                      <q-toggle
                        :value="props.row.is_default"
                        color="info"
                      />
                    </q-td>
                  </template>
                  <template #body-cell-done="props">
                    <q-td :props="props">
                      <q-toggle
                        :value="props.row.is_done"
                        color="info"
                      />
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
                  v-model="newIssueStateFormData.title">
                  <template #append>
                    <!-- @Make it disabled if empty -->
                    <q-btn dense
                           rounded
                           flat
                           icon="keyboard_return"/>
                  </template>
                </q-input>
                <p class="text-amber q-pt-sm">* Create new Issue State by typing and pressing Enter.
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
                  dense
                  bordered
                  ref="issue_types_table"
                  row-key="title"
                  no-data-label="There are no issue types in your project"
                  :hide-bottom="true"
                  :data="issueEstimations"
                  :columns="issueEstimationsTableData.columns"
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
                      />
                    </q-td>
                  </template>
                </q-table>
              </template>
              <template #actions>
                <q-input
                  dark
                  flat
                  type="text"
                  label="New Issue Estimation"
                  color="amber"
                  v-model="newIssueEstimationFormData.title">
                  <template #append>
                    <!-- @Make it disabled if empty -->
                    <q-btn dense
                           rounded
                           flat
                           icon="keyboard_return"/>
                  </template>
                </q-input>
                <p class="text-amber q-pt-sm">* Create new Issue Estimation by typing and pressing Enter.
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
export default {
  name: 'SettingsView',
  components: { SettingPanelCard },
  data () {
    return {
      tab: 'general',
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
          }
        ]
      },
      newIssueTypeFormData: {
        title: '',
        is_default: false,
        icon: null
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
          }
        ]
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
            style: 'width: 80px;',
            sortable: true
          }
        ]
      },
      newIssueEstimationFormData: {
        title: '',
        value: 1
      }
    }
  },
  computed: {
    projectName () {
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
      return this.$store.getters['issues/ISSUE_TYPES_BY_CURRENT_PROJECT']
    },
    issueTypeIcons () {
      return this.$store.getters['issues/ISSUE_TYPE_ICONS']
    },
    issueStates () {
      return this.$store.getters['issues/ISSUE_STATES_BY_CURRENT_PROJECT']
    },
    issueEstimations () {
      return this.$store.getters['issues/ISSUE_ESTIMATIONS_BY_CURRENT_PROJECT']
    }
  },
  mounted () {
    this.$store.dispatch('issues/INIT_SPRINT_DURATIONS')
      .catch((e) => {
        console.log(e)
      })
  }
}
</script>
