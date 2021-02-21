<template>
  <q-card
    dense
    dark
    bordered
    class="q-mb-sm q-pa-xs issue-backlog">
    <q-card-section class="row items-center justify-between q-pa-sm">
      <div class="col-auto">
        # {{ issue.id }}
        <q-icon
          v-if="isIssueTypeIcon"
          :name="getIssueTypeIcon.prefix"
          :color="getIssueTypeIcon.color"
          size="sm"
          :title="getIssueTypeTitle"/>
        {{ issue.title }}
      </div>
      <div class="xs-hide md-hide sm-hide col-auto">
        <q-chip
          v-show="estimationTitle"
          dark
          size="sm"
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
  name: 'IssueBacklog',
  props: {
    issue: {
      type: Object,
      required: true
    }
  },
  computed: {
    isIssueTypeIcon () {
      return this.$store.getters['core/IS_ISSUE_TYPE_HAVE_ICON'](this.issue.type_category)
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
</style>
