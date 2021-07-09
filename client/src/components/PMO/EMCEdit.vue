<template>
	<v-container 
		v-if='isSignin && user.UserRole.code == 2 && emc.createdBy == user.id && emc.isCustom'
		class="px-0"
		fluid 
		>		
		<v-card v-if='emc==null'>
			<v-card-title class="text-h4 text-center">
				Идёт загрузка данных...
			</v-card-title>
		</v-card>	
		<v-card v-if='emc!=null'>
			<v-card-title class="text-h4">
				Редактирование УМК 
			</v-card-title>
			<v-card-text class="text-h5">
				<v-text-field
					label='Название'
					v-model=emc.title
				></v-text-field>
				<v-text-field
					label='Авторы'
					v-model=emc.authors
				></v-text-field>
				<v-text-field
					label='Класс'
					v-model=emc.grades
				></v-text-field>
				<v-select
					v-model=emc.Subject
					:items=subjects
					item-text='name'
					no-data-text='Нет данных'
					label='Предмет'
					return-object
				></v-select>
				<v-select
					v-model=emc.Level
					:items=levels
					item-text='name'
					no-data-text='Нет данных'
					label='Уровень'
					return-object
				></v-select>	
				<v-select
					v-model="emc.Publisher"
					:items=publishers
					item-text='name'
					label="Издательство"
					no-data-text='Нет данных'
					return-object
				></v-select>
			</v-card-text>
			<v-card-actions>
				<v-btn 
					text color="teal accent-4"
					@click="saveEMC(emc)"
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
import { mapState, mapActions } from 'vuex' 
import { mapMultiRowFields } from 'vuex-map-fields'
import PmoService from '../../services/pmoService'

export default {
	data: () => ({
		loading: false,
		error: null,
		message: null,
	}),
	computed: {
		...mapMultiRowFields(['emcs']),
		...mapState(['isSignin', 'subjects', 'publishers', 'levels', 'user']),
		emc() {
			return this.emcs.find((emc) => emc.id === this.$route.params.emcId && emc.createdBy === this.user.id && emc.isCustom)
		},
	},
	created() {		
		this.$store.dispatch('setAreasSidebar', false)
		this.$store.dispatch('setSubjectsSidebar', false)
	},
	methods: {
		...mapActions(['updateEMC']),
		async saveEMC(emc){
			try {
				await PmoService.setEMC(emc)
				this.updateEMC(emc)
				this.$router.push({ name: 'pmo-subject-emcs', params: { subjectCode: emc.Subject.code } })
			} catch (error) {
				this.error = error
			}
		}
	}
}
</script>
<style scope>
	
</style>