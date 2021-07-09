import Vue from 'vue'
import Vuex from 'vuex'
import { getField, updateField } from 'vuex-map-fields'
// eslint-disable-next-line
// import api from '../services/api'

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
		areas: [],
		levels: [],
		emcs: [],
		emcsOnSchool: [], 
	},
	mutations: {
		updateField,
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
		setEMCs(state, emcs) {
			state.emcs = emcs
			state.emcs = [...state.emcs]
		},
		updateEMC(state, emc) {
			const index =  state.emcs.findIndex(x => x.id === emc.id)
			if (index !== -1) {
				console.log('before mutate: ', state.emcs[index])
				state.emcs.splice(index, 0, emc)
				console.log('after mutate: ', state.emcs[index])
			}
			state.emcs = [...state.emcs]
		},
		createEMC(state, emc) {
			emc.publisherId = emc.Publisher.id
			emc.levelId = emc.Level.id
			emc.subjectId = emc.Subject.id
			console.log('mutating emc ', emc)
			state.emcs.push(emc)
			state.emcs = [...state.emcs]
		},
		deleteEMC(state, emc) {
			const index =  state.emcs.findIndex(x => x.id === emc.id)
			if (index !== -1) {
				state.emcs.splice(index, 1)
			}
			state.emcs = [...state.emcs]
		},
		updateEMCOnSchoolApproval(state, emcOnSchool) {
			const index =  state.emcsOnSchool.findIndex(x => x.id === emcOnSchool.id)
			console.log('index emcOnSchoolToChange in store: ', state.emcsOnSchool.findIndex(x => x.id === emcOnSchool.id))
			console.log('emcOnSchool ', emcOnSchool)
			if (index !== -1) {
				state.emcsOnSchool[index].isApproved = !state.emcsOnSchool[index].isApproved
			}
			console.log('state.emcsOnSchool: ', state.emcsOnSchool)
			state.emcsOnSchool = [...state.emcsOnSchool]
		},
		swapCreatingStatus(state, emc){
			const index =  state.emcs.findIndex(x => x.id === emc.id)
			if (index !== -1 && !state.emcs[index].createdBy === null) {
				state.emcs[index].isCustom = !state.emcs[index].isCustom
			}
			state.emcs = [...state.emcs]
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
		setPublishers({ commit }, publishers) {
			commit('setPublishers', publishers)
		},
		setSubjects({ commit }, subjects) {
			commit('setSubjects', subjects)
		},
		setAreas({ commit }, areas) {
			commit('setAreas', areas)
		},
		setLevels({ commit }, levels) {
			commit('setLevels', levels)
		},
		setEMCs({ commit }, emcs) {
			commit('setEMCs', emcs)
		},
		updateEMCOnSchoolApproval({ commit }, emcOnSchool) {
			commit('updateEMCOnSchoolApproval', emcOnSchool)
		},
		updateEMCOnSchool({ commit }, emcOnSchool){
			commit('updateEMCOnSchool', emcOnSchool)
		},
		updateEMC({ commit }, emc) {
			console.log('commiting updateEMC')
			commit('updateEMC', emc)
		},
		createEMC({ commit }, emc) {
			console.log('commiting createEMC ', emc)
			commit('createEMC', emc)
		},
		deleteEMC({ commit }, emc) {
			commit('deleteEMC', emc)
		},
		swapCreatingStatusEMC({ commit }, emc) {
			commit('swapCreatingStatus', emc)
		}
	},
	getters: {
		getField,
	},
})
