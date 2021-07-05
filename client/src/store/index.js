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
		isSidebarActive: false, // актив ли sidebar в данном модуле приложения
		publishers: [], // Издатели для умк. Так как они не будут меняться часто, можно хранить их в store
		subjects: [],
		areas:[],
		levels: []
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
			if (user.UserRole.code === 1) {
				state.isAdmin = true
			} else {
				state.isAdmin = false
			}
		},
		setSidebar(state, activity) {
			state.isSidebarActive = activity
		},
		setPublishers(state, publishers) {
			state.publishers = publishers
		},
		setSubjects(state, subjects) {
			state.subjects = subjects
		},
		setAreas(state, areas) {
			state.areas = areas
		},
		setLevels(state, levels) {
			state.levels = levels
		}
	},
	actions: {
		setToken({ commit }, token) {
			commit('setToken', token)
		},
		setUser({ commit }, user) {
			commit('setUser', user)
		},
		setSidebar({ commit }, activity) {
			commit('setSidebar', activity)
		},
		setPublishers({ commit }, publishers){
			commit('setPublishers', publishers)
		},
		setSubjects({ commit }, subjects){
			commit('setSubjects', subjects)
		},
		setAreas({ commit }, areas){
			commit('setAreas', areas)
		},
		setLevels({ commit }, levels){
			commit('setLevels', levels)
		}
	},
})
