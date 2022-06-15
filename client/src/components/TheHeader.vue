<template>
	<v-app-bar app clipped-left>
		<div class="d-flex align-center">
			<v-img
				alt="Vuetify Logo"
				class="shrink mr-2"
				contain
				src="../assets/logo.png"
				transition="scale-transition"
				width="40"
			/>
		</div>
		<v-btn v-if="!isSignin" plain @click="goTo({ name: '/' })"> Система учёта УМК </v-btn>
		<div v-if="isSignin">
			<v-btn plain :to="{ path: `/${user.UserRole.name}` }"> Система учёта УМК </v-btn>
			<v-btn v-if="user.UserRole.code == 1" plain @click="goTo({ name: 'admin-emc-on-school' })">
				УМК
			</v-btn>
			<v-btn v-if="user.UserRole.code == 1" plain @click="goTo({ name: 'admin-emc' })">
				Конструктор
			</v-btn>
			<v-btn v-if="user.UserRole.code == 2" plain @click="goTo({ name: 'pmo-emc-on-school' })">
				УМК
			</v-btn>
			<v-btn v-if="user.UserRole.code == 2" plain @click="goTo({ name: 'pmo-emc' })">
				Конструктор
			</v-btn>
			<v-btn v-if="user.UserRole.code == 3" plain @click="goTo({ name: 'poo-emc-on-school' })">
				УМК
			</v-btn>
			<v-btn v-if="user.UserRole.code == 3" plain @click="goTo({ name: 'poo-emc' })">
				Конструктор
			</v-btn>
		</div>
		<v-spacer></v-spacer>
		<v-btn v-if="isSignin" plain :to="{ path: `/${user.UserRole.name}` }">
			{{ user.username }}</v-btn
		>
		<v-btn v-if="isSignin" plain @click="signout"> Выход </v-btn>
		<v-btn v-if="!isSignin" plain @click="goTo({ name: '/' })"> Войти </v-btn>
		<!--v-btn v-if="!isSignin" plain @click="goTo({ name: 'signup' })"> Регистрация </v-btn-->
	</v-app-bar>
</template>
<script>
import { mapFields } from 'vuex-map-fields'

export default {
	computed: {
		...mapFields(['isSignin', 'user', 'token', 'activeSidebar', 'activeRouteParams']),
	},
	methods: {
		signout() {
			this.token = null
			this.user = null
			this.activeSidebar = null
			this.isSignin = false
			this.goTo({ name: '/', params: null })
		},
		goTo({ name, params }) {
			console.log({ msg: 'goTo', name, params })
			this.activeRouteParams = params
			this.$router.push({ name }).catch((err) => {
				// Ignore the vuex err regarding  navigating to the page they are already on.
				if (
					err.name !== 'NavigationDuplicated' &&
					!err.message.includes('Avoided redundant navigation to current location')
				) {
					// But print any other errors to the console
					console.log(err)
				}
			})
		},
	},
}
</script>
