<template>
  <q-card
    clickable
    dense
    dark
    bordered
    class="my-card q-ma-sm overflow-hidden text-center issue-backlog"
    @click="openEditDialog">
    <q-card-section class="q-py-sm">
      <div :class="`text-left text-muted ${ isDone ? 'text-strike': '' }`">
        {{ issue.title }}
      </div>
    </q-card-section>
    <q-card-section class="q-pa-sm row items-center justify-between" horizontal>
      <!-- Section with icon + project number -->
      <div class="col-auto">
        <q-icon
          v-if="isIssueTypeIcon"
          :name="getIssueTypeIcon.prefix"
          :color="getIssueTypeIcon.color"
          size="xs"
          class="q-pa-none"
          :title="getIssueTypeTitle"/>
        <span class="text-weight-bold q-mx-xs">
          {{ issue.project_number }}
        </span>
      </div>
      <!-- Section with estimation like xs, xxl -->
      <div class="xs-hide md-hide sm-hide col-auto">
        <q-chip
          v-show="estimationTitle"
          dark
          square
          size="md"
          :label="estimationTitle"
          color="secondary"
          text-color="amber"/>
      </div>
      <!-- Section with assignee -->
      <div class="col-auto">
        <q-chip
            v-if="assigneeUsername"
            dark
            square
            size="md"
            color="secondary"
            text-color="amber">
          <q-avatar v-if="isAvatar">
            <img :src="assignee.avatar" :alt="`${assignee.first_name} ${assignee.last_name}`">
          </q-avatar>
          <span v-if="$q.screen.gt.sm" class="overflow-dotted">
            @{{ assigneeUsername }}
          </span>
        </q-chip>
      </div>
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
    estimationTitle () {
      const estimation = this.$store.getters['core/ISSUE_ESTIMATION_BY_ID'](this.issue.estimation_category)
      try {
        return estimation.title
      } catch (e) {
        return ''
      }
    },
    isAvatar () {
      try {
        return this.assignee.avatar
      } catch (e) {
        return false
      }
    },
    assigneeUsername () {
      return this.assignee ? this.assignee.username : false
    },
    isDone () {
      return this.$store.getters['core/IS_ISSUE_STATE_DONE'](this.issue.state_category)
    },
    isIssueTypeIcon () {
      return this.$store.getters['core/IS_ISSUE_TYPE_HAVE_ICON'](this.issue.type_category)
    },
    getIssueTypeTitle () {
      return this.$store.getters['core/ISSUE_TYPE_BY_ID'](this.issue.type_category).title
    },
    getIssueTypeIcon () {
      return this.$store.getters['core/ISSUE_TYPE_ICON_BY_ISSUE_TYPE_CATEGORY_ID'](this.issue.type_category)
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
  .q-card__actions {
    padding: 4px;
  }

  .issue-backlog:hover {
    background-color: $primary!important;
    cursor: pointer;
  }

  .overflow-dotted {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
