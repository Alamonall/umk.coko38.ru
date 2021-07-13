<template>
	<v-container 
		v-if='isSignin && user.UserRole.code == 2'
		class="px-0"
		fluid 
		>		
		<v-card v-if='emc==null'>
			<v-card-title class="text-h4 text-center">
				Подождите...Данные либо грузятся, либо произошла ошибка. <br>
				Попробуйте перезайти и попробовать снова		
			</v-card-title>
		</v-card>	
		<v-card v-if='emc!=null'>
			<v-card-title class="text-h4">
				Редактирование УМК 
			</v-card-title>
			<v-card-text class="text-h5">
				<v-text-field
					label="Название"
					v-model="emc.title"
				></v-text-field>
				<v-text-field
					label="Авторы"
					v-model="emc.authors"
				></v-text-field>
				<v-text-field
					label="Класс"
					v-model="emc.grades"
				></v-text-field>
				<v-select
					v-model="emc.Subject"
					:items="subjects"
					item-text="name"
					no-data-text="Нет данных"
					label="Предмет"
					return-object
				></v-select>
				<v-select
					v-model="emc.Level"
					:items="levels"
					item-text="name"
					no-data-text="Нет данных"
					label="Уровень"
					return-object
				></v-select>	
				<v-select
					v-model="emc.Publisher"
					:items="publishers"
					item-text="name"
					label="Издательство"
					no-data-text="Нет данных"
					return-object
				></v-select>
			</v-card-text>
			<v-card-actions>
				<v-btn 
					text color="teal accent-4"
					@click="saveEMC"
					>					
					Сохранить изменения
				</v-btn>
				<v-spacer></v-spacer>
				<v-btn text color="red accent-2"
					:to="{ name: 'pmo-emcs' }"
					>
					Отменить редактирование
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-container>
</template>
<script>
import { mapFields } from 'vuex-map-fields'
import PmoService from '../../services/pmoService'

export default {
	data: () => ({
		loading: false,
		error: null,
		message: null,
		emc: null,
	}),
	computed: {
		...mapFields(['isSignin', 'subjects', 'publishers', 'levels', 'user']),
	},
	created() {		
		this.$store.dispatch('setAreasSidebar', false)
		this.$store.dispatch('setSubjectsSidebar', false)
		this.getEMCsForEdit()
	},
	methods: {
		async getEMCsForEdit() {
			try {
				const response = await PmoService.getEMCs(this.$route.params)
				if(response.status === 200) {
					const [localEMC] = response.data.emcs
					console.log('response: ', localEMC)
					this.emc = localEMC
				} else {
					this.$router.push({ name: 'pmo-subject-emcs', params: { subjectCode: this.emc.Subject.code } })
				}
			} catch (error) { this.error = error }
		},
		async saveEMC(){
			try {
				console.log('this.emc: ', this.emc)
				await PmoService.setEMC(this.emc)
				this.$store.dispatch('updateEMC', this.emc)
				this.$router.push({ name: 'pmo-subject-emcs', params: { subjectCode: this.emc.Subject.code } })
			} catch (error) { this.error = error }
		},
	}
}
</script>
<style scope>
	
</style>