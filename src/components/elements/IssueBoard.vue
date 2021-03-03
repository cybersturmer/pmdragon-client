<template>
  <q-card
    dense
    dark
    bordered
    class="my-card q-ma-sm overflow-hidden text-center issue-backlog">
    <q-card-section>
      <span :class="`text-muted ${ isDone ? 'text-strike': '' }`">
        #{{ issue.id }}
        <q-icon
          v-if="isIssueTypeIcon"
          :name="getIssueTypeIcon.prefix"
          :color="getIssueTypeIcon.color"
          size="xs"
          :title="getIssueTypeTitle"/>
        {{ issue.title }}
      </span>
    </q-card-section>
    <q-card-section class="q-pa-xs row items-center justify-between" horizontal>
      <div class="col-auto">
        <q-chip
            v-if="assigneeUsername"
            dark
            class="text-left"
            size="md"
            color="secondary"
            text-color="amber"
            style="border-radius: 15px">
          <q-avatar v-if="isAvatar">
            <img :src="assignee.avatar" :alt="`${assignee.first_name} ${assignee.last_name}`">
          </q-avatar>
          <span>@{{ assigneeUsername }}</span>
        </q-chip>
      </div>
      <div
        class="xs-hide md-hide sm-hide col-auto">
        <q-chip
          v-show="estimationTitle"
          dark
          size="md"
          :label="estimationTitle"
          color="secondary"
          text-color="amber"
          style="border-radius: 15px"/>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
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
</style>