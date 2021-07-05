<template>
	<v-container
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
					:value=emc.title
				></v-text-field>
				<v-text-field
					label='Авторы'
					:value=emc.authors
				></v-text-field>
				<v-text-field
					label='Класс'
					:value=emc.grades
				></v-text-field>
				<v-select
					v-model=emc.Subject
					:items=subjects
					item-text='name'
					no-data-text='Нет данных'
					label='Уровень'
				></v-select>
				<v-select
					v-model=emc.level
					:items=levels
					item-text='name'
					no-data-text='Нет данных'
					label='Уровень'
				></v-select>	
				<v-select
					v-model=emc.Publisher
					:items=publishers
					item-text='name'
					label="Издательство"
					no-data-text='Нет данных'
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
					@click="$emit('onSetEMC', emc)"
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
import AdminService from '../services/adminService' 

export default {
	data: () => ({
		loading: false,
		error: null,
		emc: null,
		levels: [
			{ code: 1, name: 'Базовый уровень' }, { code: 2, name: 'Углубленный уровень' }, { code: 3, name: 'Специальный уровень' }
		]
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
		}
	},
	async mounted() {
		try {
				const [ emc ] = (await AdminService.getEMCs(this.$route.params)).data.emcs
				this.emc = emc
			} catch (err) {
				this.error = err
			}
	},
}
</script>
<style scope>
	
</style>