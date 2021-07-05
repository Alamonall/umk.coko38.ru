import api from './api'

export default {
	getAdminData() {
		return api().get('/admin')
	},
	getEMCsOnSchool(params = null) {
		return api().get(`/admin
			${params?.schoolCode ? '/schools/'.concat(params.schoolCode) : ''}
			${params?.subjectCode ? '/subjects/'.concat(params.subjectCode) : ''}
			/emcs-on-school`)
	},
	getEMCs(params = null) {
		return api().get(`/admin
			${params?.schoolCode ? '/schools/'.concat(params.schoolCode) : ''}
			${params?.subjectCode ? '/subjects/'.concat(params.subjectCode) : ''}
			/emcs
			${params?.emcId ? `/${params.emcId}` : ''}`)
	},
	setEMC(EMC) {
		console.log(EMC)
		return api().put(`/admin/emcs/${EMC.id}`, EMC)
	},
	deleteEMC(emc = null) {
		return api().delete(`/admin/emcs/${emc.id}/delete`)
	},
	setEMCOnSchool(EMCOnSchool) {
		return api().put(`/admin/emcOnSchool/${EMCOnSchool.id}`, EMCOnSchool)
	},
	createEMC(EMC = null) {
		return api().post('/admin/emcs/create', EMC)
	},
	attachTo(params = null, emcId) {
		console.log('attachTo: ', params)
		return api().post(`/admin
			${params?.areaCode ? '/areas/'.concat(params.areaCode) : ''}
			${params?.schoolCode ? '/schools/'.concat(params.schoolCode) : ''}
			/emcs/${emcId}/attach`)
	},
	detachFrom(params = null, emcId) {
		return api().delete(`/admin
			${params?.areaCode ? '/areas/'.concat(params.areaCode) : ''}
			${params?.schoolCode ? '/schools/'.concat(params.schoolCode) : ''}
			/emcs/${emcId}/detach`)
	},
}
