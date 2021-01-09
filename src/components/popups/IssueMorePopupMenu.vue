<template>
  <q-menu dark fit anchor="bottom start" self="top start" auto-close>
    <q-list dense style="min-width: 150px">
      <q-item
        clickable
        v-close-popup
        @click="removeIssue">
        <q-item-section>
          Remove Issue
        </q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script>
import { Dialogs } from 'pages/mixins/dialogs'

export default {
  name: 'IssueMorePopupMenu',
  mixins: [Dialogs],
  props: {
    issue: {
      type: Object,
      required: true
    }
  },
  methods: {
    removeIssue () {
      const dialog = [
        'Confirmation',
        `Would you like to delete issue: "${this.issue.title}"`,
        'Remove',
        'danger'
      ]
      this.showOkCancelDialog(...dialog)
        .onOk(() => {
          try {
            this.$store.dispatch('issues/DELETE_ISSUE', this.issue)
            this.$emit('remove', this.issue.id)
          } catch (e) {
            this.showError(e)
          }
        })
    }
  }

}
</script>

<style scoped>

</style>
