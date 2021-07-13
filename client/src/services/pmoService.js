import api from './api'

export default {
	getUserData() {
		return api().get('/pmo')
	},
	getEMCsOnSchool(params = null) {
		return api().get(`/pmo
			${params?.schoolCode ? '/schools/'.concat(params.schoolCode) : ''}
			${params?.subjectCode ? '/subjects/'.concat(params.subjectCode) : ''}
			/emcs-on-school`)
	},
	getEMCs(params = null) {
		return api().get(`/pmo
			${params?.schoolCode ? '/schools/'.concat(params.schoolCode) : ''}
			${params?.subjectCode ? '/subjects/'.concat(params.subjectCode) : ''}
			/emcs
			${params?.emcId ? `/${params.emcId}` : ''}`)
	},
	setEMC(EMC) {
		console.log(EMC)
		return api().put(`/pmo/emcs/${EMC.id}`, EMC)
	},
	deleteEMC(emc = null) {
		return api().delete(`/pmo/emcs/${emc.id}/delete`)
	},
	setEMCOnSchool(EMCOnSchool) {
		console.log('EMCOnSchool:', { ...EMCOnSchool })
		return api().put(`/pmo/emcOnSchool/${EMCOnSchool.id}`, { ...EMCOnSchool })
	},
	createEMC(EMC = null) {
		return api().post('/pmo/emcs/create', EMC)
	},
	attachTo(params = null, emcId) {
		console.log('attachTo: ', params)
		return api().post(`/pmo
			${params?.areaCode ? '/areas/'.concat(params.areaCode) : ''}
			${params?.schoolCode ? '/schools/'.concat(params.schoolCode) : ''}
			${params?.subjectCode ? '/subjects/'.concat(params.subjectCode) : ''}
			/emcs/${emcId}/attach`)
	},
	detachFrom(params = null, emcId) {
		return api().delete(`/pmo
			${params?.areaCode ? '/areas/'.concat(params.areaCode) : ''}
			${params?.schoolCode ? '/schools/'.concat(params.schoolCode) : ''}
			${params?.subjectCode ? '/subjects/'.concat(params.subjectCode) : ''}
			/emcs/${emcId}/detach`)
	},
}
