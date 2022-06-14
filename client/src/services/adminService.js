import api from './api'

export default {
	getUserData() {
		return api().post('/admin')
	},
	getEmcOnSchool({ areaId, schoolId, subjectId, limit, skip }) {
		return api().post('/admin/list_emc_on_school', { areaId, schoolId, subjectId, limit, skip })
	},
	getEmc({ emcId, areaId, schoolId, subjectId, limit, skip }) {
		return api().post('/admin/list_emc', { emcId, areaId, schoolId, subjectId, limit, skip })
	},
	getEmcToAttach({ areaId, schoolId, subjectId, skip, limit }) {
		return api().post('/admin/list_emc_to_attach', { areaId, schoolId, subjectId, skip, limit })
	},
	updateEmc({ emc, areaId, schoolId, subjectId, limit, skip }) {
		return api().post('/admin/update_emc', { emc, areaId, schoolId, subjectId, limit, skip })
	},
	deleteEmc({ emcId, areaId, schoolId, subjectId, limit, skip }) {
		return api().post('/admin/delete_emc', { emcId, areaId, schoolId, subjectId, limit, skip })
	},
	updateEmcOnSchool({
		emcOnSchoolId,
		usingCoz,
		correctionCoz,
		swapCoz,
		studentsCount,
		isApproved,
	}) {
		console.log({
			msg: 'updateEmcOnSchool: ',
			emcOnSchoolId,
			usingCoz,
			correctionCoz,
			swapCoz,
			studentsCount,
			isApproved,
		})
		return api().post('/admin/update_emc_on_school', {
			emcOnSchoolId,
			usingCoz,
			correctionCoz,
			swapCoz,
			studentsCount,
			isApproved,
		})
	},
	createEmc({ emc }) {
		return api().post('/admin/create_emc', {
			title: emc.title,
			authors: emc.authors,
			grades: emc.grades,
			publisherId: emc.Publisher.id,
			subjectId: emc.Subject.id,
			levelId: emc.Level.id,
		})
	},
	attachTo({
		emcId,
		areaId,
		schoolId,
		subjectId,
		swapCoz,
		usingCoz,
		correctionCoz,
		studentsCount,
	}) {
		console.log({ subjectId, swapCoz, usingCoz, correctionCoz, studentsCount })
		return api().post('/admin/attach_emc', {
			emcId,
			areaId,
			schoolId,
			subjectId,
			swapCoz,
			usingCoz,
			correctionCoz,
			studentsCount,
		})
	},
	detachFrom({ areaId, schoolId, subjectId, emcOnSchoolId }) {
		return api().post('/admin/detach_emc', { areaId, schoolId, subjectId, emcOnSchoolId })
	},
}
