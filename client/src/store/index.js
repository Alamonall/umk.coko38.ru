import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	strict: true, // нельзя изменять state без мутаций
	state: {
		user: null,
		token: null,
		isSignin: false,
		isSubjectsSidebar: false, // активность sidebar со списком предметов
		isAreasSidebar: false, // активность sidebar со списком Мо и Оо
		publishers: [], // Издатели для умк. Так как они не будут меняться часто, можно хранить их в store
		subjects: [],
		areas:[],
		levels: [],
		emcsToAttach: [],
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
		},
		setSubjectsSidebar(state, activity) {
			state.isSubjectsSidebar = activity
		},
		setAreasSidebar(state, activity) {
			state.isAreasSidebar = activity
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
		},
		setEMCsToAttach(state, emcsToAttach){
			state.emcsToAttach = emcsToAttach
		},
		updateEMCsToAttach(state, emc){
			const existsAtIndex = state.emcsToAttach.indexOf(emc)
			if(existsAtIndex === -1){
				state.emcsToAttach.push(emc)
			} else {
				state.emcsToAttach.splice(existsAtIndex, 0, emc)
			}
			state.emcsToAttach = [...state.emcsToAttach]
		},
		removeFromEMCsToAttach(state, emc){
			const existsAtIndex = state.emcsToAttach.indexOf(emc)
			if(existsAtIndex !== -1){
				state.emcsToAttach.splice(existsAtIndex, 1, emc)
			} 
			state.emcsToAttach = [...state.emcsToAttach]
		}
	},
	actions: {
		setToken({ commit }, token) {
			commit('setToken', token)
		},
		setUser({ commit }, user) {
			commit('setUser', user)
		},
		setSubjectsSidebar({ commit }, activity) {
			commit('setSubjectsSidebar', activity)
		},
		setAreasSidebar({ commit }, activity) {
			commit('setAreasSidebar', activity)
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
		},
		setEMCsToAttach({ commit }, emcsToAttach){
			commit('setEMCsToAttach', emcsToAttach)
		},
		updateEMCsToAttach({ commit }, emc){
			commit('updateEMCsToAttach', emc)
		},
		removeFromEMCsToAttach({ commit }, emc){
			commit('removeFromEMCsToAttach', emc)
		},
	},
})
