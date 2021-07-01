import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	strict: true, // нельзя изменять state без мутаций
	state: {
		user: null,
		token: null,
		isSignin: false,
		isAdmin: false,
	},
	mutations: {
		setToken(state, token) {
			state.token = token
			if (token) {
				state.isSignin = true
			} else {
				state.isSignin = false
			}
		},
		setUser(state, user) {
			state.user = user
			if (user.roleCode === 1) {
				state.isAdmin = true
			} else {
				state.isAdmin = false
			}
		},
	},
	actions: {
		setToken({ commit }, token) {
			commit('setToken', token)
		},
		setUser({ commit }, user) {
			commit('setUser', user)
		},
	},
})
