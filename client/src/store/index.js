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
		activeSidebar: null, // активность sidebar со списком предметов
		publishers: [], // Издатели для умк. Так как они не будут меняться часто, можно хранить их в store
		subjects: [],
		areas: [],
		levels: [],
		emcs: [],
		emcsOnSchool: [],
		activeRouteParams: {
			subjectId: null,
			areaId: null,
			schoolId: null,
		},
	},
	mutations: {
		updateField,
	},
	getters: {
		getField,
	},
})
