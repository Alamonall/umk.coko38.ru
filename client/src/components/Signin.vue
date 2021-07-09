<template>
	<v-row class="d-flex justify-center">
		<v-col class="mt-5" cols="12" sm="3">
			<v-form>
				<v-text-field
					v-model="username"
					type="username"
					name="username"
					maxlength="20"
					placeholder="Введите логин"
					require
				></v-text-field>
				<v-text-field
					v-model="password"
					type="password"
					name="input-10-1"
					label="Введите пароль"
					placeholder="Введите пароль"
					hint="Как минимум 8 символов"
					require
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
		username: '',
		password: '',
		error: null,
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
				if (this.$store.state.user.UserRole.code === 1) this.$router.push('/admin')
				else if (this.$store.state.user.UserRole.code === 2) this.$router.push('/pmo')
				else if (this.$store.state.user.UserRole.code === 3) this.$router.push('/poo')
			} catch (error) {
				this.error = error
			}
		},
	},
}
</script>
<style scoped></style>
