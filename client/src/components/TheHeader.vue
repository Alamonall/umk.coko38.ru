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
		<v-btn 	
			v-if='!isSignin'		
			plain 
			:to="{ name: '/' }"
			> 
			Система учёта УМК 
		</v-btn>
		<div v-if='isSignin' >
			<v-btn 
				plain 
				:to="{ path: `/${ user.UserRole.name }` }"
				>
				Система учёта УМК 
			</v-btn>
			<v-btn 
				v-if='user.UserRole.code == 1' 
				plain 
				:to="{ name: 'admin-emcs-on-school-index' }"
				>
				УМК 
			</v-btn>
			<v-btn 
				v-if='user.UserRole.code == 1' 
				plain 
				:to="{ name: 'admin-emcs' }"
				> 
				Конструктор 
			</v-btn>
			<v-btn 
				v-if='user.UserRole.code == 2' 
				plain 
				:to="{ name: 'pmo-emcs-on-school-index' }"
				>
				УМК 
			</v-btn>
			<v-btn 
				v-if='user.UserRole.code == 2' 
				plain 
				:to="{ name: 'pmo-emcs' }"
				> 
				Конструктор 
			</v-btn>
			<v-btn 
				v-if='user.UserRole.code == 3' 
				plain 
				:to="{ name: 'poo-emcs-on-school-index' }"
				>
				УМК 
			</v-btn>
			<v-btn 
				v-if='user.UserRole.code == 3' 
				plain 
				:to="{ name: 'poo-emcs' }"
				> 
				Конструктор 
			</v-btn>

		</div>
		<v-spacer></v-spacer>
		<v-btn 
			v-if='isSignin'
			plain 
			:to="{ path: `/${ user.UserRole.name }` }" 
			> 
			{{user.UserRole.code	}} {{ user.username }}
		</v-btn>
		<v-btn v-if="isSignin" plain @click='signout' > Выход </v-btn>
		<v-btn v-if="!isSignin" plain :to="{ name: '/' }"> Войти </v-btn>
		<v-btn v-if="!isSignin" plain :to="{ name: 'signup' }"> Регистрация </v-btn>
  </v-app-bar>
</template>
<script>
import { mapState } from 'vuex'

export default {
  methods: {
    signout() {
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
      this.$router.push({ name: '/' })
    },
  },
	computed: {
		...mapState([
      'isSignin',
			'user'
    ])
	}
}
</script>
