<template>
	<q-chat-message
		:name="title"
		:sent="isMe"
		:size="size"
		:bg-color="color"
		text-color="accent">
		<!-- Block with avatar for participant -->
		<template #avatar>
			<q-avatar v-if="avatar">
				<img :src="avatar"
						 :alt="title"
						 class="q-message-avatar q-message-avatar--sent">
			</q-avatar>
		</template>
		<!-- Message body - Mobile version -->
		<template #default>
			<q-list dense separator>
				<q-slide-item
					@right="edit"
					@left="remove"
					:right-color="color"
					left-color="negative"
					:class="`text-accent bg-${color}`">
					<template v-if="isItMe" v-slot:right>
						<div class="row items-center">
							Edit
							<q-icon right name="mdi-comment-edit" />
						</div>
					</template>
					<template v-if="isItMe" v-slot:left>
						<div class="row items-center">
							<q-icon left name="mdi-comment-remove" />
							Remove
						</div>
					</template>
					<q-item class="q-px-sm q-py-sm">
						<div v-html="message.description"
								 class="justify-center"/>
					</q-item>
				</q-slide-item>
			</q-list>
		</template>
		<!-- Message updated stamp -->
		<template #stamp>
			<div class="col q-px-sm text-accent">{{ getRelativeDatetime }}</div>
		</template>
	</q-chat-message>
</template>

<script>
import { ChatMessageMixin } from 'src/pages/mixins/chatMessageMixin'

export default {
	name: 'IssueChatMobileMessage',
	mixins: [
		ChatMessageMixin
	]
}
</script>
