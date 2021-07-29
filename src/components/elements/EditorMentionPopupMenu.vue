<template>
	<q-menu
		square
		auto-close
		no-focus
		:value="visible">
		<!-- List for persons -->
		<q-list bordered
						separator>
			<!-- Item with username, we create mentioning chip on clicking it-->
			<q-item
				v-for="person in persons"
				:key="person.id"
				v-ripple
				clickable
				@click="$emit('selected', person)">
				<q-item-section>
					@{{ person.username }}
				</q-item-section>
			</q-item>
		</q-list>
	</q-menu>
</template>

<script>
export default {
	name: 'EditorMentionPopupMenu',
	emits: [
		'selected'
	],
	props: {
		visible: {
			type: Boolean,
			required: false,
			default: false
		},
		persons: {
			type: Array,
			required: true
		}
	}
}
</script>
