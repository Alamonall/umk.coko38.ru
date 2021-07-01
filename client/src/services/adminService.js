import api from './api'

export default {
	getAdminData() {
		return api().get('/admin')
	},
	getArea(areaCode) {
		return api().get(`/admin/area/${areaCode}`)
	},
	getSchool(areaCode, schoolCode) {
		return api().get(`/admin/area/${areaCode}/school/${schoolCode}`)
	},
	getSubject(areaCode, schoolCode, subjectCode) {
		return api().get(`/admin/area/${areaCode}/school/${schoolCode}/subjects/${subjectCode}`)
	},
	getGia(areaCode, schoolCode, subjectCode, giaCode) {
		return api().get(
			`/admin/area/${areaCode}/school/${schoolCode}/subjects/${subjectCode}/gia/${giaCode}`,
		)
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
