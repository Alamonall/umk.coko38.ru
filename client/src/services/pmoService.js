import api from './api'

export default {
	getUserData() {
		return api().post('/pmo')
	},
	getEmcsOnSchool({ schoolId, subjectId, skip, limit }) {
		console.log('pmo service ', { subjectId, schoolId, skip, limit })
		return api().post('/pmo/list_emc_on_school', {
			subjectId,
			skip,
			limit,
		})
	},
	getEmcs({ emcId, subjectId, schoolId, skip, limit }) {
		return api().post('/pmo/list_emcs', { emcId, subjectId, schoolId, skip, limit })
	},
	getEmcsForAttach({ subjectId, schoolId, skip, limit }) {
		return api().post('/pmo/list_emcs_for_attach', { subjectId, schoolId, skip, limit })
	},
	updateEmc({ subjectId, schoolId, skip, limit, emc }) {
		return api().post('/pmo/update_emc', { subjectId, schoolId, skip, limit, emc })
	},
	deleteEmc({ emcId }) {
		return api().post('/pmo/delete_emc', { emcId })
	},
	updateEmcOnSchool({ emcId, usingCoz, correctionCoz, swapCoz, studentsCount }) {
		return api().post('/pmo/update_emc_on_school', {
			emcId,
			usingCoz,
			correctionCoz,
			swapCoz,
			studentsCount,
		})
	},
	createEmc({ emc }) {
		return api().post('/pmo/create_emc', {
			title: emc.title,
			authors: emc.authors,
			grades: emc.grades,
			publisherId: emc.Publisher.id,
			subjectId: emc.Subject.id,
			levelId: emc.Level.id,
		})
	},
	attachTo({ emcId, subjectId, schoolId, swapCoz, usingCoz, correctionCoz, studentsCount }) {
		return api().post('/pmo/attach_emc', {
			emcId,
			subjectId,
			swapCoz,
			usingCoz,
			correctionCoz,
			studentsCount,
			schoolId,
		})
	},
	detachFrom({ schoolId, subjectId, emcId }) {
		return api().post('/pmo/detach_emc', { subjectId, schoolId, emcId })
	},
}
