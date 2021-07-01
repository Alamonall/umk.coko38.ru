<template>
  <v-app>
		<PageHeader/>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import PageHeader from './components/TheHeader.vue'

export default {
  name: 'App',
  components: {
		PageHeader
	},
  data: () => ({
    //
  }),
}
</script>
