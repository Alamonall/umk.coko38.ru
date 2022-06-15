<template>
	<v-container v-if="isSignin && user.UserRole.code == 1" fluid>
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
				v-if="emcsOnSchool.length === 0"
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
			<v-col v-if="emcsOnSchool.length > 0" cols="12">
				<v-pagination v-model="page" :length="totalPages"></v-pagination>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import AdminService from '../../services/adminService'
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
			'activeSidebar',
			'emcsOnSchool',
			'isSignin',
			'user',
			'emcs',
			'subjects',
			'areas',
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
		this.activeSidebar = 'admin'
		this.getEmcOnSchool()
		this.getEmc()
	},
	methods: {
		async getEmc() {
			try {
				const response = await AdminService.getEmcToAttach({ ...this.activeRouteParams })
				console.log({ msg: 'get_emcs_for_attach', ...response.data })
				this.emcs = response.data.emcs
			} catch (err) {
				this.error = err
			}
		},
		async getEmcOnSchool() {
			// Получение УМК школы
			try {
				const response = await AdminService.getEmcOnSchool({
					...this.activeRouteParams,
					skip: (this.page - 1) * this.limit,
					limit: this.limit,
				})
				console.log({
					msg: 'get_emcs_on_school',
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
				 await AdminService.detachFrom({
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
				await AdminService.updateEmcOnSchool({
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
