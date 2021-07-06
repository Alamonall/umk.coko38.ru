<template>
	<v-row dense v-if='isSignin && user.UserRole.code == 1'>
		<v-col cols="12">
			<EMCOnSchoolSelector
			v-if='$route.params.subjectCode'
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
				@onSwapApprovingStatusEMCOnSchool='swapApprovingStatusEMCOnSchool'
				/>
		</v-col>
	</v-row>
</template>

<script>
import { mapState } from 'vuex'
import AdminService from '../../services/adminService'
import EMCOnSchoolCard from './EMCOnSchoolCard.vue' 
import EMCOnSchoolSelector from '../EMCOnSchoolSelector.vue' 

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
      'isSignin',
			'user'
    ]),
  },
	created() {
		this.$store.dispatch('setAreasSidebar', true) // Включаем sidebar для EMCsOnSchool
		this.$store.dispatch('setSubjectsSidebar', false) // На всякий случай ставим sidebar EMCs на false
		this.getEMCsOnSchool()
		this.filterEMCBySubject()
	},
	watch: {
		$route() {
			this.getEMCsOnSchool()
			this.filterEMCBySubject()
		}
	},
	methods: {
		async filterEMCBySubject(){
			this.emcs = this.$store.state.emcsToAttach.filter((emc)=> emc.Subject.code === this.$route.params.subjectCode)
		},
		async getEMCsOnSchool() {
			// Получение УМК школы 
			try {
				const response = await AdminService.getEMCsOnSchool(this.$route.params)
				this.emcsOnSchool = response.data.emcsOnSchool
			} catch (err){ this.error = err }
		},
		async attachEMCTo(emcModel) {
			try {
				// Отправляем серверу запрос на добавление Умк для данной школы (через параметры)
				const response = await AdminService.attachTo(this.$route.params, emcModel.entry.id)
				this.message = response.data.message

				// удаляем из списка умк умк, которую мы только что добавили к школе, чтобы не было возможности её добавить повторно
				this.emcs.splice( this.emcs.indexOf(emcModel.entry), 1)
				this.$store.dispatch('removeFromEMCsToAttach', emcModel.entry)
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
