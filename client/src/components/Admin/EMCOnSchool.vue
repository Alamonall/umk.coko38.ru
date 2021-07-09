<template>
	<v-row dense v-if='isSignin && user.UserRole.code == 1'>
		<v-col cols="12">
				<EMCOnSchoolSelector
					v-if="$route.params.subjectCode"
				/>
		</v-col>
		<v-card v-if='emcsOnSchool.length === 0 && this.$route.params.schoolCode !== undefined'
			class="mx-auto text-center"
		>
			УМК у данного ОО отсутствует
		</v-card>
		<v-col cols="12">
			<EMCOnSchoolCard
				@onDetachEMCFrom="detachEMCFrom"
				@onSwapApprovingStatusEMCOnSchool="swapApprovingStatusEMCOnSchool"
			/>
		</v-col>
	</v-row>
</template>

<script>
// import { mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import AdminService from '../../services/adminService'
import EMCOnSchoolCard from './EMCOnSchoolCard.vue' 
import EMCOnSchoolSelector from './EMCOnSchoolSelector.vue' 

export default {
	components: {
		EMCOnSchoolCard,
		EMCOnSchoolSelector,
	},
	data: () => ({
		// emcsOnSchool: [],
		error: null,
	}),
	computed: {
		...mapFields(['emcsOnSchool', 'isSignin', 'user', 'emcs']),
	},
	created() {
		this.$store.dispatch('setAreasSidebar', true) // Включаем sidebar для EMCsOnSchool
		this.$store.dispatch('setSubjectsSidebar', false) // На всякий случай ставим sidebar EMCs на false
		this.getEMCsOnSchool()
	},
	watch: {
		$route() {
			this.getEMCsOnSchool()
		}
	},
	methods: {
		async getEMCs() {
			try {
				console.log('eos get emcs')

				const response = await AdminService.getEMCs(this.$route.params)

				console.log('eos new emcs ', response.data.emcs)
				// this.$store.commit('setEMCs', response.data.emcs)
				this.emcs = [...response.data.emcs]

			} catch (err) { this.error = err}
		},
		async getEMCsOnSchool() {
			// Получение УМК школы 
			try {
				const response = await AdminService.getEMCsOnSchool(this.$route.params)
				console.log('eos school: ', this.$route.params.schoolCode,'; subject: ',
					this.$route.params.subjectCode, '; eos: ',  response.data.emcsOnSchool)
				this.emcsOnSchool = response.data.emcsOnSchool
				// this.$store.dispatch('setEMCsOnSchool', response.data.emcsOnSchool)
				// this.emcsOnSchool = response.data.emcsOnSchool
			} catch (err){ this.error = err }
		},
		async detachEMCFrom(emcOnSchool) {
			try {
				console.log('eos detachEMCFrom')
				// Отправляем запрос серверу на удаление умк из данной школы (через параметры)
				const response = await AdminService.detachFrom(this.$route.params, emcOnSchool.emcId)

				this.emcsOnSchool = [...response.data.emcsOnSchool]
				this.getEMCs()
			} catch (err){ this.error = err}
		},
		async swapApprovingStatusEMCOnSchool(emcOnSchool){
			try {
				console.log('eos not from the store: ', emcOnSchool)
				this.$store.dispatch('updateEMCOnSchoolApproval', emcOnSchool)

				await AdminService.setEMCOnSchool(emcOnSchool)
			} catch (error) {
				this.error = error
			}
		}
	},
}
</script>
<style scoped></style>
