<template>
	<div class="q-pa-xs col-xs-12 col-sm-5 col-md-6 col-lg-3 col-xl-2">
		<q-card bordered>
			<q-card-section style="height: 90px">
				<p class="q-ma-sm q-pa-none">
					<strong>Email:</strong>
					{{ invitation.email }}
				</p>
				<p class="q-ma-sm q-pa-none" :title="invitation.expired_at">
					<strong>Expired:</strong> {{ expiredAt }}
				</p>
			</q-card-section>
		</q-card>
	</div>
</template>

<script>
export default {
	name: 'InvitedTeamMemberCard',
	props: {
		invitation: {
			type: Object,
			required: true
		}
	},
	computed: {
		expiredAt () {
			return this.$moment(this.invitation.expired_at).fromNow()
		}
	}
}
</script>

<style scoped>

</style>
