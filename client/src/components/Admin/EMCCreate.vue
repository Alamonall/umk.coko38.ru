<template>
	<v-container
    class="px-0"
    fluid
		v-if='isSignin && user.UserRole.code == 1' 
  	>
		<v-card>
			<v-card-title class="text-h4">
				Создание УМК
			</v-card-title>
			<v-card-text class="text-h5">
				<v-text-field
					v-model='emc.title'
					label='Название'
					placeholder='Введите название умк'
				></v-text-field>
				<v-text-field
					v-model='emc.authors'
					label='Авторы'
					placeholder='Введите автора умк'
				></v-text-field>
				<v-text-field
					v-model='emc.grades'
					label='Класс'
					placeholder='Введите классы умк'
				></v-text-field>
				<v-select
					v-model='emc.Level'
					:items=levels
					item-text='name'
					no-data-text='Нет данных'
					label="Уровень"
					solo
					return-object
				></v-select>
				<v-select
					v-model='emc.Publisher'
					:items=publishers
					item-text='name'
					no-data-text='Нет данных'
					label="Издательство"
					placeholder='Выберите издательство умк'
					solo
					return-object
				></v-select>
				<v-select
					v-model='emc.Subject'
					:items=subjects
					item-text='name'
					no-data-text='Нет данных'
					label="Предмет"
					placeholder='Выберите предмет умк'
					solo
					return-object
				></v-select>
			</v-card-text>
			<v-card-actions>
				<v-btn text color="teal accent-4"
					@click='createEMC'
				>
					Создать УМК
				</v-btn>
				<v-btn text color="red accent-2"
					:to="{ name: 'admin-emcs' }"
					>
					Назад
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-container>
</template>
<script>
import { mapState } from 'vuex' 
import AdminService from '../../services/adminService'

export default {
	data : () => ({
		error: null,
		message: null,
		emc: {
			title: null,
			grades: null,
			gia: null,
			subjectId: null,
			Subject: null,
			publisherId: null,
			isCustom: null,
			Level: null,
			levelId: null
		},
	}),
	created() {
		this.$store.dispatch('setAreasSidebar', false)
		this.$store.dispatch('setSubjectsSidebar', false)
	},
	computed: {
    ...mapState([
    	'store',
      'isSignin',
			'user',
			'publishers',
			'subjects',
			'levels'
    ]),	
	},
	methods: {
		async createEMC(){
			try {
				this.$set( this.emc, 'publisherId', this.$store.state.publishers.find(x => x.id === this.emc.Publisher.id).id)
				this.$set( this.emc, 'subjectId', this.$store.state.subjects.find(x => x.code === this.emc.Subject.code).id)
				this.$set( this.emc, 'levelId', this.$store.state.levels.find(x => x.id === this.emc.Level.id).id)

				const response = await AdminService.createEMC(this.emc)
				this.message = response.data.message
				this.$store.dispatch('updateEMCsToAttach', this.emc)
				this.$router.push({ name:'admin-emcs' })
			} catch (error) {
				this.error = error
			}
		}
	}
}
</script>
<style scope>
	
</style>