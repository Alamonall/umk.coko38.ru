<template>
  <v-app-bar app color="primary" dark clipped-left>
    <div class="d-flex align-center">
      <v-img
        alt="Vuetify Logo"
        class="shrink mr-2"
        contain
        src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
        transition="scale-transition"
        width="40"
      />
    </div>

		<v-btn plain :to="{ name: '/' }"> Система учёта УМК </v-btn>
		<v-btn plain :to="{ name: 'admin-emcs-on-school' }"> УМК </v-btn>
		<v-btn plain :to="{ name: 'admin-emcs' }"> Конструктор </v-btn>

    <v-spacer></v-spacer>
    <v-btn v-if="!this.$store.state.isSignin" plain :to="{ name: '/' }"> Войти </v-btn>
    <v-btn v-if="!this.$store.state.isSignin" plain :to="{ name: 'signup' }"> Регистрация </v-btn>
    <v-btn v-if="this.$store.state.isSignin" plain :to="{ name: '/' }"> Выход </v-btn>
  </v-app-bar>
</template>
<script>
export default {
  methods: {
    signout() {
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
      this.$router.push({ name: '/' })
    },
  },
}
</script>
