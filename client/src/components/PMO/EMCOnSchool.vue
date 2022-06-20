<template>
	<v-container v-if="isSignin && user.UserRole.code == 2" fluid>
		<v-row>
			<v-col cols="12">
				<h1 class="text-center">{{ subjectTitle }}</h1>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="12">
				<EmcOnSchoolSelector v-if="activeRouteParams && activeRouteParams.subjectId" />
			</v-col>
			<v-card
				v-if="emcsOnSchool.length == 0"
				class="mx-auto text-center"
			>
				Отсутствуют УМК
			</v-card>
			<v-col cols="12">
				<v-row v-for="emcOnSchool in emcsOnSchool" :key="emcOnSchool.id">
					<EmcOnSchoolCard
						:emc-on-school="emcOnSchool"
						@onDetachEmcFrom="detachEmcFrom"
						@onSwapApprovingStatusEmcOnSchool="swapApprovingStatusEmcOnSchool"
					/>
				</v-row>
			</v-col>
			<v-col cols="12" v-if="emcsOnSchool.length > 0">
				<v-pagination v-model="page" :length="totalPages" :total-visible="20"></v-pagination>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import PmoService from '../../services/pmoService'
import EmcOnSchoolCard from './EMCOnSchoolCard.vue'
import EmcOnSchoolSelector from './EMCOnSchoolSelector.vue'

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
		...mapFields([
			'activeRouteParams',
			'emcsOnSchool',
			'isSignin',
			'user',
			'emcs',
			'subjects',
			'activeSidebar',
		]),
		subjectTitle() {
			return (
				this.subjects.find((subject) => subject.id === this.activeRouteParams?.subjectId)?.name ??
				'Все предметы'
			)
		},
		routeParams() {
			return this.activeRouteParams
		},
	},
	watch: {
		routeParams() {
			this.getEmcOnSchool()
			this.getEmc()
		},
		page() {
			this.getEmcOnSchool()
		},
	},
	created() {
		this.activeSidebar = 'pmo'
		this.getEmcOnSchool()
		this.getEmc()
	},
	methods: {
		async getEmc() {
			try {
				const response = await PmoService.getEmcToAttach({ ...this.activeRouteParams })
				console.log({ msg: 'get_emcs_for_attach', ...response.data })
				this.emcs = response.data.emcs
			} catch (err) {
				this.error = err
			}
		},
		async getEmcOnSchool() {
			// Получение УМК школы
			try {
				const response = await PmoService.getEmcOnSchool({
					...this.activeRouteParams,
					skip: (this.page - 1) * this.limit,
					limit: this.limit,
				})
				console.log({
					msg: 'get_emcs_on_school',
					...this.activeRouteParams,
					skip: (this.page - 1) * this.limit,
					limit: this.limit,
					totalEmcsOnSchool: response.data.totalEmcsOnSchool,
					emcsOnSchool: response.data.emcsOnSchool,
				})
				this.emcsOnSchool = response.data.emcsOnSchool
				this.totalPages = Math.ceil(response.data.totalEmcsOnSchool / this.limit)
			} catch (err) {
				this.error = err
			}
		},
		async detachEmcFrom(emcOnSchool) {
			try {
				// Отправляем запрос серверу на удаление умк из данной школы (через параметры)
				await PmoService.detachFrom({
					...this.activeRouteParams,
					emcOnSchoolId: emcOnSchool.id,
				}) 
				this.activeRouteParams = { ...this.activeRouteParams }
			} catch (err) {
				this.error = err
			}
		},
		async swapApprovingStatusEmcOnSchool(emcOnSchool) {
			try {
				await PmoService.updateEmcOnSchool({
					emcOnSchoolId: emcOnSchool.id,
					isApproved: !emcOnSchool.isApproved,
				})
				this.activeRouteParams = { ...this.activeRouteParams }
			} catch (err) {
				this.error = err
			}
		},
	},
}
</script>
<style scoped></style>
