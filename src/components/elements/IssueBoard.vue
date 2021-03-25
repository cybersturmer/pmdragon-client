<template>
  <q-card
    dark
    dense
    bordered
    class="my-card q-ma-sm overflow-hidden issue-backlog"
    @click="$q.screen.lt.sm ? false : openEditDialog"
  >
    <q-card-section horizontal>
      <q-card-section
        clickable
        v-ripple
        @click="openEditDialog"
        class="q-pb-sm">
        <!-- Title -->
        <q-card-section class="q-pa-none text-justify">
          <span :class="`text-left text-muted ${ isDone ? 'text-strike': '' }`">
            {{ issue.title }}
          </span>
        </q-card-section>
        <!-- Additional information block -->
        <q-card-section horizontal class="row items-center justify-between">
          <!-- Project number and icon -->
          <div class="col q-pa-none">
            <q-icon
              v-if="getIssueTypeIcon"
              :name="getIssueTypeIcon.prefix"
              :color="getIssueTypeIcon.color"
              size="xs"
              class="q-pa-none"
              :title="getIssueTypeTitle"/>
            <!-- Project number -->
            <span class="text-weight-bold q-mx-xs">
            {{ issue.project_number }}
            </span>
          </div>
          <!-- Estimation title like XXL -->
          <div
            v-if="$q.screen.gt.sm"
            class="col q-pa-none">
            <q-chip
              v-show="estimationTitle"
              dark
              square
              size="sm"
              :label="estimationTitle"
              color="secondary"
              text-color="amber"/>
          </div>
          <!-- Avatar and assignee information -->
          <div class="col q-pa-none overflow-dotted">
            <q-avatar
              v-if="assigneeAvatar"
              square
              size="sm">
              <img :src="assignee.avatar" :alt="`${assignee.first_name} ${assignee.last_name}`">
            </q-avatar>
            <q-chip
              v-if="$q.screen.gt.sm"
              dark
              square
              size="sm"
              color="secondary"
              text-color="amber">
              <span class="overflow-dotted">
                @{{ assignee.username }}
              </span>
            </q-chip>
          </div>
        </q-card-section>
      </q-card-section>
      <q-card-section
        v-if="$q.screen.lt.sm"
        v-ripple
        class="row justify-center items-center">
        <q-icon
          name="mdi-dots-grid"
          size="sm"
          title="Open Dialog"
          class="vertical-middle handle"/>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script>
import IssueEditDialog from 'components/dialogs/IssueEditDialog.vue'

export default {
  name: 'IssueBoard',
  props: {
    issue: {
      type: Object,
      required: true
    }
  },
  computed: {
    assignee () {
      return this.$store.getters['auth/PERSON_BY_ID'](this.issue.assignee)
    },
    assigneeAvatar () {
      try {
        return this.assignee.avatar
      } catch (e) {
        return false
      }
    },
    getIssueTypeIcon () {
      return this.$store.getters['core/ISSUE_TYPE_ICON_BY_ISSUE_TYPE_CATEGORY_ID'](this.issue.type_category)
    },
    getIssueTypeTitle () {
      return this.$store.getters['core/ISSUE_TYPE_BY_ID'](this.issue.type_category).title
    },
    estimationTitle () {
      const estimation = this.$store.getters['core/ISSUE_ESTIMATION_BY_ID'](this.issue.estimation_category)
      try {
        return estimation.title
      } catch (e) {
        return ''
      }
    },
    isDone () {
      return this.$store.getters['core/IS_ISSUE_STATE_DONE'](this.issue.state_category)
    }
  },
  methods: {
    openEditDialog () {
      this.$q.dialog({
        parent: this,
        dark: true,
        title: 'Issue ',
        component: IssueEditDialog,
        id: this.issue.id
      })
    }
  }
}
</script>
<style lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity .25s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.issue-backlog:hover {
  background-color: $primary!important;
  cursor: pointer;
}

.handle {
  cursor: move;
}
</style>
