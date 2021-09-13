<template>
	<q-chat-message
		:sent="sent"
		:avatar="avatar"
		bg-color="grey-9"
		text-color="accent">
		<!-- Message body - Mobile version -->
		<template v-if="person" #name>
			<span class="text-bold">@{{ person.username }}</span>
			<span>
				[ {{  person.first_name }} {{ person.last_name }} ]
			</span>
		</template>
		<!-- Version for mine messages -->
		<template v-if="isManageable" #default>
			<div v-for="message in messagePack.list"
					 :key="message.id">
				<q-list dense separator>
					<q-slide-item
						label
						@right="edit($event, message.id)"
						@left="remove($event, message.id)"
						right-color="grey-9"
						left-color="negative"
						style="min-width: 220px"
						class="text-accent bg-grey-9">
						<template #right>
							<div class="row items-center">
								Edit
								<q-icon size="sm" right name="mdi-comment-edit"/>
							</div>
						</template>
						<template #left>
							<div class="row items-center">
								<q-icon size="1rem" left name="mdi-comment-remove" />
								Remove
							</div>
						</template>
						<q-item class="q-px-sm q-py-sm">
							<div v-html="message.description"
									 class="justify-center"/>
						</q-item>
					</q-slide-item>
				</q-list>
			</div>
		</template>
		<template v-else #default>
			<div v-for="message in messagePack.list"
					 :key="message.id"
					 v-html="message.description"
					 class="q-pa-sm"
			/>
		</template>
		<!-- Message updated stamp -->
		<template #stamp>
			<div class="col q-px-sm text-accent">{{ getRelativeDatetime }}</div>
		</template>
	</q-chat-message>
</template>

<script>
import { defineComponent } from 'vue'
import { ChatMessageMixin } from 'src/pages/mixins/chatMessageMixin'

export default defineComponent({
	name: 'IssueChatMobileMessage',
	mixins: [
		ChatMessageMixin
	]
})
</script>
