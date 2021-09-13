<template>
  <div class="full-width q-pa-md text-center">
    <div class="text-h5"><q-icon name="mdi-history"/>&nbsp;You have not started a sprint.</div>
    <div class="text-subtitle1">Go to
				<router-link :to="{ name: 'backlog' }" custom v-slot="{ navigate }" class="text-secondary">
					<span @click="navigate" @keypress.enter="navigate" role="link" class="text_underlined cursor-pointer">
						Backlog page
					</span>
				</router-link>
		</div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'NoStartedSprintNotification'
})
</script>
