<template>
  <div class="fixed-center text-center">
    <p class="text-faded">
      Sorry, nothing here...<strong>(404)</strong>
    </p>
    <q-btn
      color="secondary"
      style="width:200px;"
      :to="{name: 'login'}"
      label="Go back"
    />
  </div>
</template>

<script >
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'Error404'
})
</script>
