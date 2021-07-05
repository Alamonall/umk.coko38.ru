<template>
  <v-row class="d-flex justify-center">
    <v-col class="mt-5" cols="12" sm="3">
      <v-form>
        <v-text-field
          v-model="username"
          type="username"
          name="username"
          maxlength="20"
        ></v-text-field>
        <v-text-field
          v-model="password"
          type="password"
          name="input-10-1"
          label="Normal with hint text"
          hint="At least 8 characters"
        ></v-text-field>
        <v-btn @click="signin"> Войти </v-btn>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import auth from '../services/auth'

export default {
  data: () => ({
      username: 'Введите логин',
      password: 'Пароль',
			error: null
	}),
  methods: {
    async signin() {
      try {
        const response = await auth.signin({
          username: this.username,
          password: this.password,
        })

				console.log(response)
        this.$store.dispatch('setToken', response.data.token)
        this.$store.dispatch('setUser', response.data.user)
				
        this.$router.push(`/${ response.data.user.UserRole.name }`)
      } catch (error) {
				console.log(error)
        this.error = error
      }
    },
  },
}
</script>
<style scoped></style>
