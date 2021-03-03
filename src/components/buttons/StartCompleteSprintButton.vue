<template>
  <q-btn
    dark
    outline
    color="amber"
    :size="size"
    :label="label"
    @click="recognizeAction">
  </q-btn>
</template>

<script>
export default {
  name: 'StartCompleteSprintButton',
  props: {
    sprint: {
      type: Object,
      required: true
    },
    size: {
      type: String,
      default: 'sm'
    }
  },
  computed: {
    label () {
      const completeSprintLabel = this.$q.screen.lt.md ? 'Complete' : 'Complete sprint'
      const startSprintLabel = this.$q.screen.lt.md ? 'Start' : 'Start sprint'
      return this.sprint.is_started ? completeSprintLabel : startSprintLabel
    }
  },
  methods: {
    startSprint (sprintId) {
      /** Start not empty sprint **/
      if (!this.sprint.started_at || !this.sprint.finished_at) {
        this.$q.dialog({
          dark: true,
          title: 'Unable to start sprint',
          message: 'Cant start sprint without start and end date. Set started at and finished at dates first.',
          ok: {
            label: 'OK',
            color: 'amber'
          }
        })
      } else {
        this.$store.dispatch('core/START_SPRINT', sprintId)
          .catch((e) => {
            console.log(e)
          })
      }
    },
    completeSprint (sprintId) {
      /** Complete started sprint **/
      this.$q.dialog({
        dark: true,
        title: 'Complete sprint?',
        message: 'Would you like to complete Sprint',
        ok: {
          label: 'Complete',
          color: 'amber',
          outline: true
        },
        cancel: {
          label: 'Cancel',
          color: 'amber',
          flat: true
        }
      })
        .onOk(() => {
          this.$store.dispatch('core/COMPLETE_SPRINT', sprintId)
            .catch((e) => {
              console.log(e)
            })
        })
    },
    recognizeAction () {
      this.sprint.is_started ? this.completeSprint(this.sprint.id) : this.startSprint(this.sprint.id)
    }
  }
}
</script>
