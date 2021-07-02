import api from './api'

export default {
	getAdminData() {
		return api().get('/admin')
	},
	getEMCs(areaCode, schoolCode, subjectCode) {
		return api().get(`/admin/area/${areaCode}/school/${schoolCode}/subject/${subjectCode}`)
	},
	setEMC(emcId) {
		return api().put(`/admin/emc/${emcId}`)
	},
	addEMC() {
		return api().post('/admin/new/emc')
	},
	attachToArea(areaCode) {
		return api().post(`/admin/area/${areaCode}`)
	},
	attachToSchool(areaCode, schoolCode) {
		return api().post(`/admin/area/${areaCode}/school/${schoolCode}`)
	},
	detachFromArea(areaCode) {
		return api().delete(`/admin/area/${areaCode}`)
	},
	detachFromSchool(areaCode, schoolCode) {
		return api().delete(`/admin/area/${areaCode}/school/${schoolCode}`)
	},
}
