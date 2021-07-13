<template>
	<q-chat-message
		:name="title"
		:sent="isItMe"
		:size="size"
		bg-color="accent"
		text-color="amber"
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
		<!-- Message body - Desktop version -->
		<template #default>
			<q-list dense separator>
				<div v-html="message.description"
						 class="justify-center q-pa-sm"/>
			</q-list>
		</template>
		<!-- Message updated stamp -->
		<template #stamp>
			<div class="row items-center" style="height: 28px">
				<div class="col q-px-sm">{{ getRelativeDatetime }}</div>
				<div class="col text-right">
					<q-btn v-show="visible"
							 flat
							 dense
							 color="amber"
							 icon="mdi-dots-vertical"
							 class="q-pr-xs"
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
	mixins: [ChatMessageMixin],
	data () {
		return {
			visible: false
		}
	},
	methods: {
		showMenu () {
			if (!this.isItMe) return false
			this.visible = true
		},
		hideMenu () {
			if (!this.isItMe) return false
			this.visible = false
		}
	}
}
</script>
