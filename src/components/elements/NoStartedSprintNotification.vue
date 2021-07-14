<template>
  <div class="full-width q-pa-md text-center">
    <div class="text-h5"><q-icon name="mdi-history"/>&nbsp;You have not started a sprint.</div>
    <span class="text-subtitle1">Go to
        <router-link :to="{ name: 'backlog' }" class="text-secondary">
          Backlog page
        </router-link> and start a sprint to continue...</span>
  </div>
</template>

<script>
export default {
	name: 'NoStartedSprintNotification'
}
</script>
