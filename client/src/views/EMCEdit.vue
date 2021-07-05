<template>
	<v-container
    class="px-0"
    fluid
		v-if='this.$store.state.isSignin && this.$store.state.user.UserRole.code == 1' 
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
					:value=emc.authors
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
					v-model=emc.Publisher
					:items=publishers
					item-text='name'
					label="Издательство"
					no-data-text='Нет данных'
					return-object
				></v-select>		
				<v-checkbox
					v-if=emc.isCustom
					v-model='emc.isCustom'
					label="Пользовательский"
				></v-checkbox>
			</v-card-text>
			<v-card-actions>
				<v-btn 
					text color="teal accent-4"
					@click='saveEMC'
					>					
					Сохранить изменения
				</v-btn>
				<v-spacer></v-spacer>
				<v-btn text color="red accent-2"
					:to="{ name: 'admin-emcs' }"
					>
					Отменить редактирование
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-container>
</template>
<script>
import { mapState } from 'vuex' 
import AdminService from '../services/adminService' 

export default {
	data: () => ({
		loading: false,
		error: null,
		message: null,
		emc: {
			title: null,
			grades: null,
			gia: null,
			Subject: null,
			publisherId: null,
			Publisher: null,
			isCustom: null,
			levelId: null,
			Level: null,
		},
	}),
	created() {
		this.$store.dispatch('setSidebar', true) // Выключаем sidebar для EMCsOnSchool и включаем для конструктора
	},
	computed: {
		publishers(){
			return this.$store.state.publishers
		},
		subjects(){
			return this.$store.state.subjects
		},
		levels(){
			return this.$store.state.levels
		},
    ...mapState([
      'isUserLoggedIn',
			'isSidebarActive',
			'user'
    ])
	},
	async mounted() {
		try {
				const [ emc ] = (await AdminService.getEMCs(this.$route.params)).data.emcs
				this.emc = emc
			} catch (err) {
				this.error = err
			}
	},
	methods: {
		async saveEMC(){
			try {
				console.log('saveEM3C: ',  this.$store.state.levels.find(x => x.id === this.emc.Level.id).id)
				this.$set( this.emc, 'publisherId', this.$store.state.publishers.find(x => x.id === this.emc.Publisher.id).id)
				this.$set( this.emc, 'subjectId', this.$store.state.subjects.find(x => x.code === this.emc.Subject.code).id)
				this.$set( this.emc, 'levelId', this.$store.state.levels.find(x => x.id === this.emc.Level.id).id)
				
				const response = await AdminService.setEMC(this.emc)
				this.message = response.data.message
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