import api from './api'

export default {
	getUserData() {
		return api().post('/poo')
	},
	getEmcOnSchool({ subjectId, skip, limit }) {
		return api().post('/poo/list_emc_on_school', {
			subjectId,
			skip,
			limit,
		})
	},
	getEmc({ emcId, subjectId, skip, limit }) {
		return api().post('/poo/list_emc', { emcId, subjectId, skip, limit })
	},
	getEmcToAttach({ subjectId, skip, limit }) {
		return api().post('/poo/list_emc_to_attach', { subjectId, skip, limit })
	},
	updateEmc({ subjectId, skip, limit, emc }) {
		return api().post('/poo/update_emc', { subjectId, skip, limit, emc })
	},
	deleteEmc({ emcId }) {
		return api().post('/poo/delete_emc', { emcId })
	},
	updateEmcOnSchool({ emcOnSchoolId, usingCoz, correctionCoz, swapCoz, studentsCount }) {
		return api().post('/poo/update_emc_on_school', {
			emcOnSchoolId,
			usingCoz,
			correctionCoz,
			swapCoz,
			studentsCount,
		})
	},
	createEmc({ emc }) {
		return api().post('/poo/create_emc', {
			title: emc.title,
			authors: emc.authors,
			grades: emc.grades,
			publisherId: emc.Publisher.id,
			subjectId: emc.Subject.id,
			levelId: emc.Level.id,
		})
	},
	attachTo({ emcId, subjectId, swapCoz, usingCoz, correctionCoz, studentsCount }) {
		return api().post('/poo/attach_emc', {
			emcId,
			subjectId,
			swapCoz,
			usingCoz,
			correctionCoz,
			studentsCount,
		})
	},
	detachFrom({ subjectId, emcOnSchoolId }) {
		return api().post('/poo/detach_emc', { subjectId, emcOnSchoolId })
	},
}
