<template>
	<v-row dense>
		<v-col cols="12">
			<v-skeleton-loader
				class="mx-auto"
				type="EMCCard"
			></v-skeleton-loader>
			<EMCCard
				v-for='emc in emcs'
				:key='emc.id'
				:emc='emc'
				@onSwapCreatingStatusEMC='swapCreatingStatusEMC'
				/>
		</v-col>
	</v-row>
</template>
<script>
import AdminService from '../services/adminService'
import EMCCard from '../components/EMCCard.vue' 

export default {
	components: {
		EMCCard
	},
	data: () => ({
		emcs: [],
		error: null,
	}),
	created() {
		this.getEMCsForConstructor()
		this.$store.dispatch('setSidebar', true) // Выключаем sidebar для EMCsOnSchool и включаем для конструктора
	},
	methods: {
		async getEMCsForConstructor() {
			try {
				const response = await AdminService.getEMCs()
				this.emcs = response.data.emcs
			} catch (err){ this.error = err }
		},
		async attachEMCTo(emcModel, areaCode, schoolCode) {
			try {
				// Отправляем серверу запрос на добавление Умк для данной школы (через параметры)
				const response = await AdminService.attachTo({areaCode, schoolCode}, emcModel.entry.id)
				console.log('attach: ', response.data.emcsOnSchool)
				// удаляем из списка умк умк, которую мы только что добавили к школе, чтобы не было возможности её добавить повторно
				this.emcs.splice( this.emcs.indexOf(emcModel.entry), 1)
				// добавляем в список умк у школы умк, которую мы только что добавили и получили в ответе от сервера
				this.emcsOnSchool.splice(0, 0, response.data.emcsOnSchool[0])

				// обновлять sidebar
			} catch (err){ this.error = err }
		},
		async detachEMCFrom(emcOnSchool, areaCode, schoolCode) {
			try {
				// Отправляем запрос серверу на удаление умк из данной школы (через параметры)
				await AdminService.detachFrom({areaCode, schoolCode}, emcOnSchool.emcId)

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
	}
}
</script>
<style>
	
</style>