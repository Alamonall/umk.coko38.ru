<template>
	<v-container
    class="px-0"
    fluid
  	>
		<v-card>
			<v-card-title class="text-h4">
				Создание УМК
			</v-card-title>
			<v-card-text class="text-h5">
				<v-text-field
					label='Название'
					placeholder='Введите название умк'
				></v-text-field>
				<v-text-field
					label='Авторы'
					placeholder='Введите автора умк'
				></v-text-field>
				<v-text-field
					label='Класс'
					placeholder='Введите классы умк'
				></v-text-field>
				<v-select
					v-model=emc.level
					:items=levels
					item-text='name'
					no-data-text='Нет данных'
					label="Уровень"
					solo
					return-object
				></v-select>
				<v-select
					:items=publishers
					item-text='name'
					no-data-text='Нет данных'
					label="Издательство"
					placeholder='Выберите издательство умк'
					solo
					return-object
				></v-select>
			</v-card-text>
			<v-card-actions>
				<v-btn text color="teal accent-4"
					@click="$emit('createEmc', emc)"
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
export default {
	data : () => ({
		error: null,
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
		}
	}
}
</script>
<style scope>
	
</style>