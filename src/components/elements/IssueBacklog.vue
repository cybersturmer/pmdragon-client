<template>
  <q-card
    clickable
    dense
    bordered
    class="q-mb-sm issue-backlog"
    @click="$q.screen.lt.sm ? false : openEditDialog">
    <q-card-section horizontal>
      <q-card-section
        v-ripple
        @click="openEditDialog"
        class="row full-width q-pa-sm items-center">
        <!-- ID + Icon + Title -->
        <div>
          <q-icon
            v-if="isIssueTypeIcon"
            :name="getIssueTypeIconPrefix"
						:style="`color: ${getIssueTypeIcon.color}`"
            size="sm"
            :title="getIssueTypeTitle"/>
          &nbsp;
          <span class="text-weight-bold">{{ issue.project_number }}</span>
          &nbsp;
          <span>{{ issue.title }}</span>
        </div>
      </q-card-section>
      <q-card-section v-if="$q.screen.gt.sm && estimationTitle" class="q-pa-sm">
        <!-- Estimation data X, L, XL ... -->
        <div class="xs-hide sm-hide float-right">
          <q-chip
						square
            size="sm"
            :label="estimationTitle"
						text-color="white"
            color="info"/>
        </div>
      </q-card-section>
      <q-card-section
        v-if="$q.screen.lt.sm"
        v-ripple
        class="row justify-center items-center">
        <!-- Open Dialog button -->
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
import IssueEditDialog from 'src/components/dialogs/IssueEditDialog'

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
		getIssueTypeIconPrefix () {
			try {
				return this.getIssueTypeIcon.prefix
			} catch (e) {
				return ''
			}
		},
		getIssueTypeIconColor () {
			try {
				return this.getIssueTypeIcon.color
			} catch (e) {
				return ''
			}
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
	},
	methods: {
		openEditDialog () {
			this.$q.dialog({
				component: IssueEditDialog,
				componentProps: {
					id: this.issue.id
				},
				parent: this
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
    filter: brightness(120%);
    cursor: pointer;
  }

  .handle {
    cursor: move;
  }
</style>
