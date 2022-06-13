<template>
	<v-container v-if="isSignin && user.UserRole.code == 3" fluid>
		<v-row v-if="activeRouteParams.subjectId">
			<v-col cols="12">
				<h1 class="text-center">{{ subjectTitle }}</h1>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="12">
				<EmcOnSchoolSelector v-if="activeRouteParams.subjectId" />
			</v-col>
			<v-card
				v-if="emcsOnSchool.length === 0 && activeRouteParams.schoolId !== undefined"
				class="mx-auto text-center"
			>
				УМК у данного ОО отсутствует
			</v-card>
			<v-col cols="12">
				<v-row v-for="emcOnSchool in emcsOnSchool" :key="emcOnSchool.id">
					<EmcOnSchoolCard :emc-on-school="emcOnSchool" @onDetachEmcFrom="detachEmcFrom" />
				</v-row>
			</v-col>
			<v-col cols="12" :disabled="emcs.length > limit">
				<v-pagination 
					v-model="page"
					:length="totalPages"
				></v-pagination>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import PooService from '../../services/pooService'
import EmcOnSchoolCard from './EmcOnSchoolCard.vue'
import EmcOnSchoolSelector from './EmcOnSchoolSelector.vue'

export default {
	components: {
		EmcOnSchoolCard,
		EmcOnSchoolSelector,
	},
	data: () => ({
		error: null,
		page: 1,
		totalPages: 1,
		limit: 5,
	}),
	computed: {
		...mapFields(['activeSidebar', 'emcsOnSchool', 'isSignin', 'user', 'emcs', 'subjects', 'activeRouteParams']),
		subjectTitle() {
			return this.subjects.find((subject) => subject.id === this.activeRouteParams.subjectId)?.name ?? 'Все предметы' 
		},
		routeParams() {
			return this.activeRouteParams
		}
	},
	watch: {
		routeParams() {
			this.page = 1
			this.getEmcsOnSchool()
		},
		page() {
			this.getEmcsOnSchool()
		}
	},
	created() {
		this.activeSidebar = 'poo'
		this.getEmcsOnSchool()
	},
	methods: {
		async getEmcs() {
			try {
				const response = await PooService.getEmcsForAttach({
					...this.activeRouteParams
				})
				this.emcs = [...response.data.emcs]
			} catch (err) {
				this.error = err
			}
		},
		async getEmcsOnSchool() {
			// Получение УМК школы
			try {
				const response = await PooService.getEmcsOnSchool({
					subjectId: this.activeRouteParams.subjectId,
					skip: (this.page-1)*this.limit, limit: this.limit
				})
				this.emcsOnSchool = [...response.data.emcsOnSchool]
				this.totalPages = Math.ceil(response.data.totalEmcsOnSchool/this.limit)
			} catch (err) {
				this.error = err
			}
		},
		async detachEmcFrom(emcOnSchool) {
			try {
				// Отправляем запрос серверу на удаление умк из данной школы (через параметры)
				const response = await PooService.detachFrom({ ...this.activeRouteParams,  emcId: emcOnSchool.emcId },)
				this.emcsOnSchool = [...response.data.emcsOnSchool]
				this.getEmcs()
			} catch (err) {
				this.error = err
			}
		},
	},
}
</script>
<style scoped></style>
