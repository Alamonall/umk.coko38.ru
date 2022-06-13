<template>
	<v-container v-if="isSignin && user.UserRole.code == 2" fluid>
		<v-row v-if="$route.params.subjectCode">
			<v-col cols="12">
				<h1 class="text-center">{{ subjectTitle }}</h1>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="12">
				<EMCOnSchoolSelector v-if="$route.params.subjectCode" />
			</v-col>
			<v-card
				v-if="emcsOnSchool.length === 0 && this.$route.params.schoolCode !== undefined"
				class="mx-auto text-center"
			>
				УМК у данного ОО отсутствует
			</v-card>
			<v-col cols="12">
				<v-row v-for="emcOnSchool in emcsOnSchool" :key="emcOnSchool.id">
					<EMCOnSchoolCard
						:emc-on-school="emcOnSchool"
						@onDetachEMCFrom="detachEMCFrom"
						@onSwapApprovingStatusEMCOnSchool="swapApprovingStatusEMCOnSchool"
					/>
				</v-row>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import PmoService from '../../services/pmoService'
import EMCOnSchoolCard from './EMCOnSchoolCard.vue'
import EMCOnSchoolSelector from './EMCOnSchoolSelector.vue'

export default {
	components: {
		EMCOnSchoolCard,
		EMCOnSchoolSelector,
	},
	data: () => ({
		error: null,
	}),
	computed: {
		...mapFields(['emcsOnSchool', 'isSignin', 'user', 'emcs', 'subjects', 'activeSidebar']),
		subjectTitle() {
			return this.subjects.find((subject) => subject.code === this.$route.params.subjectCode).name
		},
	},
	watch: {
		$route() {
			this.getEMCsOnSchool()
		},
	},
	created() {
		this.activeSidebar = 'pmo'
		this.getEMCsOnSchool()
	},
	methods: {
		async getEMCs() {
			try {
				const response = await PmoService.getEMCs(this.$route.params)
				this.emcs = [...response.data.emcs]
			} catch (err) {
				this.error = err
			}
		},
		async getEMCsOnSchool() {
			// Получение УМК школы
			try {
				const response = await PmoService.getEMCsOnSchool(this.$route.params)
				this.emcsOnSchool = [...response.data.emcsOnSchool]
			} catch (err) {
				this.error = err
			}
		},
		async detachEMCFrom(emcOnSchool) {
			try {
				// Отправляем запрос серверу на удаление умк из данной школы (через параметры)
				const response = await PmoService.detachFrom(this.$route.params, emcOnSchool.emcId)
				this.emcsOnSchool = [...response.data.emcsOnSchool]
				this.getEMCs()
			} catch (err) {
				this.error = err
			}
		},
		async swapApprovingStatusEMCOnSchool(emcOnSchool) {
			try {
				const response = await PmoService.setEMCOnSchool({
					...emcOnSchool,
					isApproved: !emcOnSchool.isApproved,
				})
				this.$store.dispatch('updateEMCOnSchool', response.data.emcOnSchool)
			} catch (err) {
				this.error = err
			}
		},
	},
}
</script>
<style scoped></style>
