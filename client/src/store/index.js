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
		activeSidebar: '', // активность sidebar со списком предметов
		publishers: [], // Издатели для умк. Так как они не будут меняться часто, можно хранить их в store
		subjects: [],
		areas: [],
		levels: [],
		emcs: [],
		emcsOnSchool: [],
		activeRouteParams: {
			subjectId: 1,
			areaId: 1,
			schoolId: 1,
		},
	},
	mutations: {
		updateField,
		updateEmc(state, emc) {
			const index = state.emcs.findIndex((x) => x.id === emc.id)
			if (index !== -1) {
				state.emcs[index] = { ...emc }
			}
			state.emcs = [...state.emcs]
		},
		deleteEmc(state, emc) {
			const index = state.emcs.findIndex((x) => x.id === emc.emcId)
			if (index !== -1) {
				state.emcs.splice(index, 1)
			}
			state.emcs = [...state.emcs]
		},
		updateEmcOnSchool(state, emcOnSchool) {
			const index = state.emcsOnSchool.findIndex((x) => x.id === emcOnSchool.id)
			if (index !== -1) {
				state.emcsOnSchool[index] = { ...emcOnSchool }
			}
			state.emcsOnSchool = [...state.emcsOnSchool]
		},
	},
	actions: {
		updateEmcOnSchool({ commit }, emcOnSchool) {
			commit('updateEmcOnSchool', emcOnSchool)
		},
		updateEmc({ commit }, emc) {
			commit('updateEmc', emc)
		},
		deleteEmc({ commit }, emc) {
			commit('deleteEmc', emc)
		},
	},
	getters: {
		// activeRouteParams(state) {
		// 	return state.activeRouteParams
		// },
		getField,
	},
})
