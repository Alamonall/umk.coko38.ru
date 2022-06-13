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
import { mapFields } from 'vuex-map-fields'
import auth from '../services/auth'

export default {
	data: () => ({
		username: '',
		password: '',
		error: null,
	}),
	computed: {
		...mapFields(['token','user','isSignin']),
	},
	methods: {
		async signin() {
			try {
				const response = await auth.signin({
					username: this.username,
					password: this.password,
				})

				this.token = response.data.token
				this.user = response.data.user
				this.isSignin = true
				if (this.user.UserRole.code === 1) this.$router.push('/admin').catch(err=>console.error(err))
				else if (this.user.UserRole.code === 2) this.$router.push('/pmo').catch(err=>console.error(err))
				else if (this.user.UserRole.code === 3) this.$router.push('/poo').catch(err=>console.error(err))
			} catch (error) {
				this.error = error
			}
		},
	},
}
</script>
<style scoped></style>
