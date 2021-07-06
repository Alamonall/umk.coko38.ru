import api from './api'

export default {
	getUserData() {
		return api().get('/poo')
	},
	getEMCsOnSchool(params = null) {
		return api().get(`/poo
			${params?.schoolCode ? '/schools/'.concat(params.schoolCode) : ''}
			${params?.subjectCode ? '/subjects/'.concat(params.subjectCode) : ''}
			/emcs-on-school`)
	},
	getEMCs(params = null) {
		return api().get(`/poo
			${params?.schoolCode ? '/schools/'.concat(params.schoolCode) : ''}
			${params?.subjectCode ? '/subjects/'.concat(params.subjectCode) : ''}
			/emcs
			${params?.emcId ? `/${params.emcId}` : ''}`)
	},
	setEMC(EMC) {
		return api().put(`/poo/emcs/${EMC.id}`, EMC)
	},
	deleteEMC(emc = null) {
		return api().delete(`/poo/emcs/${emc.id}/delete`)
	},
	setEMCOnSchool(EMCOnSchool) {
		return api().put(`/poo/emcOnSchool/${EMCOnSchool.id}`, EMCOnSchool)
	},
	createEMC(EMC = null) {
		return api().post('/poo/emcs/create', EMC)
	},
	attachTo(params = null, emcId) {
		console.log('attachTo: ', params)
		return api().post(`/poo
			${params?.areaCode ? '/areas/'.concat(params.areaCode) : ''}
			${params?.schoolCode ? '/schools/'.concat(params.schoolCode) : ''}
			/emcs/${emcId}/attach`)
	},
	detachFrom(params = null, emcId) {
		return api().delete(`/poo
			${params?.areaCode ? '/areas/'.concat(params.areaCode) : ''}
			${params?.schoolCode ? '/schools/'.concat(params.schoolCode) : ''}
			/emcs/${emcId}/detach`)
	},
}
