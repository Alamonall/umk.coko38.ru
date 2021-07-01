<template>
  <v-row class="d-flex justify-center">
    <v-col class="mt-5" cols="12" sm="3">
      <v-form>
        <v-text-field
          v-model="username"
          type="username"
          name="username"
          autocomplete="off"
          maxlength="20"
        ></v-text-field>
        <v-text-field
          v-model="password"
          autocomplete="off"
          type="password"
          name="input-10-1"
          label="Normal with hint text"
          hint="At least 8 characters"
        ></v-text-field>
        <v-btn @click="signup"> Зарегистрироваться </v-btn>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import auth from '../services/auth'

export default {
  data() {
    return {
      username: 'Введите логин',
      password: 'Пароль',
    }
  },
  methods: {
    async signup() {
      await auth.signup({
        username: this.username,
        password: this.password,
      })
    },
  },
}
</script>
<style scoped></style>
