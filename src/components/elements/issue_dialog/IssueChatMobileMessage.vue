<template>
	<q-chat-message
		:name="title"
		:sent="isItMe"
		:size="size"
		:bg-color="isItMe ? 'secondary' : 'primary'"
		text-color="dark"
	>
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
					right-color="secondary"
					left-color="negative"
					class="text-accent bg-secondary">
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
					<q-item class="q-px-sm q-py-md">
						<div v-html="message.description"
								 class="justify-center"/>
					</q-item>
				</q-slide-item>
			</q-list>
		</template>
		<!-- Message updated stamp -->
		<template #stamp>
			{{ getRelativeDatetime }}
		</template>
	</q-chat-message>
</template>

<script>
import { ChatMessageMixin } from 'src/pages/mixins/chatMessageMixin'

export default {
	name: 'IssueChatMobileMessage',
	mixins: [ChatMessageMixin]
}
</script>
