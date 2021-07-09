<template>
	<v-row dense v-if='isSignin && user.UserRole.code == 3' >
		<v-col cols="12">
		<EMCOnSchoolSelector
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
				/>
		</v-col>
	</v-row>
</template>

<script>
import { mapState } from 'vuex'
import PooService from '../../services/pooService'
import EMCOnSchoolCard from './EMCOnSchoolCard.vue' 
import EMCOnSchoolSelector from './EMCOnSchoolSelector.vue' 

export default {
	components: {
		EMCOnSchoolCard,
		EMCOnSchoolSelector,
	},
	data: () => ({
		emcsOnSchool: [],
		error: null,
	}),
	computed: {
		 ...mapState([
			'isSignin',
			'user',
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
			this.emcs = this.$store.state.emcs.filter((emc)=> emc.Subject.code === this.$route.params.subjectCode)
		},
		async getEMCsOnSchool() {
			// Получение УМК школы 
			try {
				const response = await PooService.getEMCsOnSchool(this.$route.params)
				this.emcsOnSchool = response.data.emcsOnSchool
			} catch (err){ this.error = err }
		},
		async attachEMCTo(emcModel) {
			try {
				// Отправляем серверу запрос на добавление Умк для данной школы (через параметры)
				const response = await PooService.attachTo(this.$route.params, emcModel.entry.id)
				this.message = response.data.message

				// удаляем из списка умк умк, которую мы только что добавили к школе, чтобы не было возможности её добавить повторно
				this.$store.dispatch('removeFromEMCs', emcModel.entry)

				
				// добавляем в список умк у школы умк, которую мы только что добавили и получили в ответе от сервера
				if(response.data.emcsOnSchool.length > 0)
					this.emcsOnSchool.splice(0, 0, response.data.emcsOnSchool[0])
				
			} catch (err){ this.error = err }
		},
		async detachEMCFrom(emcOnSchool) {
			try {
				// Отправляем запрос серверу на удаление умк из данной школы (через параметры)
				await PooService.detachFrom(this.$route.params, emcOnSchool.emcId)

				// добавляем удалённую умк в список возможных на добавлением
				// [0] - потому что vue автоматом добавляет свойства по наблюдению, а нам нужен только сам объект
				//	- средства наблюдения есть уже у архива emcs			
				this.$set(this.emcs, this.emcs.length, emcOnSchool.EMC)

				// удаляем удалённую умк из списка умк у школы
				this.emcsOnSchool.splice( this.emcsOnSchool.indexOf(emcOnSchool), 1)

				// обновлять sidebar
			} catch (err){ this.error = err}
		},
	},
}
</script>
<style scoped></style>
