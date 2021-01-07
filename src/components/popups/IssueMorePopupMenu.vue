<template>
  <q-menu content-class="bg-accent text-white" fit anchor="bottom left" self="top right" auto-close>
    <q-list dense style="min-width: 200px">
      <q-item
        clickable
        v-close-popup
        @click="removeIssue"
      >
        <q-item-section>Remove Issue</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script>
export default {
  name: 'IssueMorePopupMenu',
  props: {
    issue: {
      type: Object,
      required: true
    }
  },
  methods: {
    removeIssue () {
      this.$q.dialog({
        dark: true,
        title: 'Confirmation',
        message: `Would you like to delete issue: ${this.issue.title}`,
        cancel: true,
        persistent: true
      })
        .onOk(() => {
          try {
            this.$store.dispatch('issues/DELETE_ISSUE', this.issue)
            this.$emit('remove', this.issue.id)
          } catch (e) {
            this.$q.dialog({
              title: 'Error - Cannot delete issue',
              message: 'Please check your Internet connection'
            })
          }
        })
    }
  }

}
</script>

<style scoped>

</style>
