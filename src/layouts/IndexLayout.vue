<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
			<router-view  v-slot="{ Component }">
				<keep-alive>
					<component :is="Component" />
				</keep-alive>
			</router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'IndexLayout'
})
</script>
