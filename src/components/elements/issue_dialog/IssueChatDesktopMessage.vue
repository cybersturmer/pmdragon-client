<template>
	<q-chat-message
		:sent="sent"
		:avatar="avatar"
		:bg-color="$q.dark.isActive ? 'grey-9' : 'grey-6'"
		:text-color="$q.dark.isActive ? 'accent' : 'dark'">
		<!-- Message body - Desktop version -->
		<template v-if="person" #name>
			<span class="text-bold">@{{ person.username }}</span>
			<span>
				[ {{  person.first_name }} {{ person.last_name }} ]
			</span>
		</template>
		<template #default>
			<div v-for="message in messagePack.list"
					 :key="message.id"
					 @mouseover="showMenu"
					 @mouseleave="hideMenu"
					 class="q-pt-xs q-pb-none q-px-sm">
				<span v-html="message.description"/>
				<q-menu v-if="isManageable" touch-position context-menu>
					<q-list dense>
						<q-item clickable @click="edit($event, message.id)">
							<q-item-section>Edit</q-item-section>
						</q-item>
						<q-item clickable @click="remove($event, message.id)">
							<q-item-section>Delete</q-item-section>
						</q-item>
					</q-list>
				</q-menu>
			</div>
		</template>
		<!-- Message updated stamp -->
		<template #stamp>
			<div class="row items-center" style="height: 28px">
				<div :class="`col q-px-sm ${ $q.dark.isActive ? 'text-accent' : 'text-black'}`">
					{{ getRelativeDatetime }}
				</div>
			</div>
		</template>
	</q-chat-message>
</template>

<script>
import { defineComponent } from 'vue'
import { ChatMessageMixin } from 'src/pages/mixins/chatMessageMixin'

export default defineComponent({
	name: 'IssueChatDesktopMessage',
	mixins: [
		ChatMessageMixin
	],
	data () {
		return {
			visible: false
		}
	},
	methods: {
		showMenu () {
			if (!this.isManageable) return false
			this.visible = true
		},
		hideMenu () {
			if (!this.isManageable) return false
			this.visible = false
		}
	}
})
</script>

<style lang="scss" scoped>
	.q-message-name {
		color: $secondary!important;
		font-weight: bold;
	}

	.q-message-text--sent:hover {
		filter: brightness(120%);
	}
</style>
