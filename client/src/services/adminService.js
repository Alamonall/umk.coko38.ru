import api from './api'

export default {
	getAdminData() {
		return api().get('/admin')
	},
	getEMCsOnSchool(params = null) {
		return api().get(`/admin
			${params?.schoolCode ? '/schools/'.concat(params.schoolCode) : ''}
			${params?.subjectCode ? '/subjects/'.concat(params.subjectCode) : ''}`)
	},
	getEMCs(params = null) {
		return api().get(`/admin
			${params?.schoolCode ? '/schools/'.concat(params.schoolCode) : ''}
			${params?.subjectCode ? '/subjects/'.concat(params.subjectCode) : ''}
			/emcs
			${params?.emcId ? `/${params.emcId}` : ''}`)
	},
	setEMC(EMC) {
		return api().put(`/admin/emcs/${EMC.id}`, EMC)
	},
	setEMCOnSchool(EMCOnSchool) {
		return api().put(`/admin/emcOnSchool/${EMCOnSchool.id}`, EMCOnSchool)
	},
	addEMC(EMC) {
		return api().post('/admin/new/emc', EMC)
	},
	attachTo(params = null, emcId) {
		return api().post(`/admin
			${params.areaCode ? '/areas/'.concat(params.areaCode) : ''}
			${params.schoolCode ? '/schools/'.concat(params.schoolCode) : ''}
			/emcs/${emcId}/attach`)
	},
	detachFrom(params = null, emcId) {
		return api().delete(`/admin
			${params.areaCode ? '/areas/'.concat(params.areaCode) : ''}
			${params.schoolCode ? '/schools/'.concat(params.schoolCode) : ''}
			/emcs/${emcId}/detach`)
	},
}
