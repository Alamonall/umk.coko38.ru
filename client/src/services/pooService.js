import api from './api'

export default {
	getUserData() {
		return api().post('/poo')
	},
	getEmcsOnSchool({ subjectId, skip, limit }) {
		console.log('poo service ', { subjectId, skip, limit })
		return api().post('/poo/list_emc_on_school', {
			subjectId,
			skip,
			limit,
		})
	},
	getEmcs({ emcId, subjectId, skip, limit }) {
		return api().post('/poo/list_emcs', { emcId, subjectId, skip, limit })
	},
	getEmcsForAttach({ subjectId, skip, limit }) {
		return api().post('/poo/list_emcs_for_attach', { subjectId, skip, limit })
	},
	updateEmc({ subjectId, skip, limit, emc }) {
		return api().post('/poo/update_emc', { subjectId, skip, limit, emc })
	},
	deleteEmc({ emcId }) {
		return api().post('/poo/delete_emc', { emcId })
	},
	updateEmcOnSchool({ emcId, usingCoz, correctionCoz, swapCoz, studentsCount }) {
		return api().post('/poo/update_emc_on_school', {
			emcId,
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
	detachFrom({ subjectId, emcId }) {
		return api().post('/poo/detach_emc', { subjectId, emcId })
	},
}
