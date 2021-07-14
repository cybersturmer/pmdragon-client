<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card flat bordered class="q-dialog-plugin">
      <q-card-section class="q-pb-none">
				<p class="text-justify">
					<a href="https://en.wikipedia.org/wiki/MIT_License" class="text-secondary text-weight-bold">
						MIT Licensed
					</a> open-source project management tool to track tasks, epics, bugs, and manage it with agile boards and sprints.</p>
      </q-card-section>
			<q-card-actions vertical class="q-py-none">
				<div class="text-h6 text-center q-pb-md">
					<q-icon name="mdi-github" size="md"/>
					GitHub
				</div>
				<q-list bordered separator>
					<q-item clickable v-ripple>
						<q-item-section>
							<a href="https://github.com/cybersturmer/pmdragon" class="q-btn q-btn--flat">
								Main repository
							</a>
						</q-item-section>
					</q-item>
					<q-item clickable v-ripple>
						<q-item-section>
							<a href="https://github.com/cybersturmer/pmdragon-core-api" class="q-btn q-btn--flat">
								API repository
							</a>
						</q-item-section>
					</q-item>
					<q-item clickable v-ripple>
						<q-item-section>
							<a href="https://github.com/cybersturmer/pmdragon-client" class="q-btn q-btn--flat">
								Client repository
							</a>
						</q-item-section>
					</q-item>
				</q-list>
			</q-card-actions>
			<q-card-section class="q-py-xs">
				<div class="row">
					<div class="col text-center">Copyright ©2020-present Vladimir Shturmer</div>
				</div>
				<div class="row">
					<div class="col text-center">Version: v{{ version }}</div>
				</div>
			</q-card-section>
			<q-card-actions vertical>
				<q-btn
					outline
					color="secondary"
					label="Okay"
					@click="onOKClick"/>
			</q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>

export default {
	name: 'AboutDialog',
	computed: {
		version () {
			return require('../../../package.json').version
		}
	},
	methods: {
		show () {
			this.$refs.dialog.show()
		},

		hide () {
			this.$refs.dialog.hide()
		},

		onDialogHide () {
			this.$emit('hide')
		},

		onOKClick () {
			this.hide()
		},

		onCancelClick () {
			this.hide()
		}
	}
}
</script>
