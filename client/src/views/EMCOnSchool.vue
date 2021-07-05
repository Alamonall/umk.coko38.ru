<template>
	<v-row dense v-if='this.$store.state.isSignin && this.$store.state.user.UserRole.code == 1' >
		<v-col cols="12">
		<EMCOnSchoolSelector
			:emcs=emcs
			@onAttachEMCTo='attachEMCTo'
			/>
		</v-col>
		<v-card v-if='emcsOnSchool.length === 0'
			class="mx-auto text-center"
		>
		УМК у данного ОО отсутствует
		</v-card>
		<v-col cols="12">
			<EMCOnSchoolCard
				v-for='emcOnSchool in emcsOnSchool'
				:key='emcOnSchool.id'
				:emcOnSchool='emcOnSchool'
				@onDetachEMCFrom='detachEMCFrom'
				@onSwapCreatingStatusEMC='swapCreatingStatusEMC'
				@onSwapApprovingStatusEMCOnSchool='swapApprovingStatusEMCOnSchool'
				/>
		</v-col>
	</v-row>
</template>

<script>
import { mapState } from 'vuex'
import AdminService from '../services/adminService'
import EMCOnSchoolCard from '../components/EMCOnSchoolCard.vue' 
import EMCOnSchoolSelector from '../components/EMCOnSchoolSelector.vue' 

export default {
	components: {
		EMCOnSchoolCard,
		EMCOnSchoolSelector,
	},
	data: () => ({
		emcsOnSchool: [],
		emcs: [],
		error: null,
  }),
	computed: {
		 ...mapState([
    	'store',
      'isUserLoggedIn',
			'isSidebarActive',
			'user'
    ]),
  },
	created() {
		this.$store.dispatch('setSidebar', false) // Включаем sidebar для EMCsOnSchool и выключаем для конструктора
		this.getEMCsOnSchool()
		this.getEMCs()
	},
	watch: {
		$route() {
			this.getEMCsOnSchool()
			this.getEMCs()
		}
	},
	methods: {
		async getEMCsOnSchool() {
			// Получение УМК школы 
			try {
				const response = await AdminService.getEMCsOnSchool(this.$route.params)
				this.emcsOnSchool = response.data.emcsOnSchool
			} catch (err){ this.error = err }
		},
		async getEMCs() {
			try {
				// Получение умк для селектора добавления				
				const response = await AdminService.getEMCs(this.$route.params)
				this.emcs = response.data.emcs
			} catch (err){ this.error = err }
		},
		async attachEMCTo(emcModel) {
			try {
				// Отправляем серверу запрос на добавление Умк для данной школы (через параметры)
				const response = await AdminService.attachTo(this.$route.params, emcModel.entry.id)
				this.message = response.data.message

				// удаляем из списка умк умк, которую мы только что добавили к школе, чтобы не было возможности её добавить повторно
				this.emcs.splice( this.emcs.indexOf(emcModel.entry), 1)
				
				// добавляем в список умк у школы умк, которую мы только что добавили и получили в ответе от сервера
				if(response.data.emcsOnSchool.length > 0)
					this.emcsOnSchool.splice(0, 0, response.data.emcsOnSchool[0])
				
			} catch (err){ this.error = err }
		},
		async detachEMCFrom(emcOnSchool) {
			try {
				// Отправляем запрос серверу на удаление умк из данной школы (через параметры)
				await AdminService.detachFrom(this.$route.params, emcOnSchool.emcId)

				// добавляем удалённую умк в список возможных на добавлением
				// [0] - потому что vue автоматом добавляет свойства по наблюдению, а нам нужен только сам объект
				//  - средства наблюдения есть уже у архива emcs			
				this.$set(this.emcs, this.emcs.length, emcOnSchool.EMC)

				// удаляем удалённую умк из списка умк у школы
				this.emcsOnSchool.splice( this.emcsOnSchool.indexOf(emcOnSchool), 1)

				// обновлять sidebar
			} catch (err){ this.error = err}
		},
		async swapCreatingStatusEMC(emcOnSchool){
			try {
				// Делаем умк официальной - что позволит добавлять её другим ПМО и ПОО
				
				emcOnSchool.EMC.isCustom = !emcOnSchool.EMC.isCustom

				const response = await AdminService.setEMC(emcOnSchool.EMC)

				this.$set(this.emcs, this.emcs.indexOf(emcOnSchool.EMC), response.data.emc[0] )
			} catch (error) {
				this.error = error
			}
		},
		async swapApprovingStatusEMCOnSchool(emcOnSchool){
			try {
				emcOnSchool.isApproved = !emcOnSchool.isApproved
				
				const response = await AdminService.setEMCOnSchool(emcOnSchool)
				this.$set(this.emcsOnSchool, this.emcsOnSchool.indexOf(emcOnSchool), response.data.emc[0] )
			} catch (error) {
				this.error = error
			}
		}
	},
}
</script>
<style scoped></style>
