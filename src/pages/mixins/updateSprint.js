export const updateSprintMixin = {
  methods: {
    startSprint (sprintId) {
      /** Start not empty sprint **/
      this.$store.dispatch('core/START_SPRINT', sprintId)
        .catch((e) => {
          console.log(e)
        })
    },
    completeSprint (sprintId) {
      /** Complete started sprint **/
      this.$store.dispatch('core/COMPLETE_SPRINT', sprintId)
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
