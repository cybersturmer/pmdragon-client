<template>
	<q-chat-message
		:sent="isMe"
		:size="size"
		:bg-color="color"
		text-color="accent"
		@mouseover="showMenu"
		@mouseleave="hideMenu">
		<!-- Block with avatar for participant -->
		<template #avatar>
			<q-avatar v-if="avatar">
				<img :src="avatar"
						 :alt="title"
						 class="q-message-avatar q-message-avatar--sent">
			</q-avatar>
		</template>
		<template #name>
			<span class="text-grey-4">{{ title }}</span>
		</template>
		<!-- Message body - Desktop version -->
		<template #default>
			<q-list dense separator>
				<div v-html="message.description"
						 class="justify-center text-accent q-pt-sm q-pl-sm q-pb-none"/>
			</q-list>
		</template>
		<!-- Message updated stamp -->
		<template #stamp>
			<div class="row items-center" style="height: 28px">
				<div class="col q-px-sm text-accent">
					{{ getRelativeDatetime }}
				</div>
				<div
					v-show="visible"
					class="col text-right">
					<q-btn
							 flat
							 dense
							 icon="mdi-dots-vertical"
							 class="q-pr-xs"
							 text-color="white"
							 label="more"
							 size="sm">
					<q-menu @mouseover="showMenu"
									@mouseleave="hideMenu"
									auto-close>
						<q-list>
							<q-item clickable @click="edit">
								<q-item-section>Edit</q-item-section>
							</q-item>
							<q-item clickable @click="remove">
								<q-item-section>Remove</q-item-section>
							</q-item>
						</q-list>
					</q-menu>
				</q-btn>
				</div>
			</div>
		</template>
	</q-chat-message>
</template>

<script>
import { ChatMessageMixin } from 'src/pages/mixins/chatMessageMixin'

export default {
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
			if (!this.isMe) return false
			this.visible = true
		},
		hideMenu () {
			if (!this.isMe) return false
			this.visible = false
		}
	}
}
</script>

<style lang="scss" scoped>
	.q-message-name {
		color: $secondary!important;
	}
</style>
