<template>
	<v-container v-if="isSignin && user.UserRole.code == 1" class="px-0" fluid>
		<v-card>
			<v-card-title class="text-h4"> Создание УМК </v-card-title>
			<v-card-text class="text-h5">
				<v-text-field
					v-model="emc.title"
					label="Название"
					placeholder="Введите название умк"
				></v-text-field>
				<v-text-field
					v-model="emc.authors"
					label="Авторы"
					placeholder="Введите автора умк"
				></v-text-field>
				<v-text-field
					v-model="emc.grades"
					label="Класс"
					placeholder="Введите классы умк"
				></v-text-field>
				<v-select
					v-model="emc.Level"
					:items="levels"
					item-text="name"
					no-data-text="Нет данных"
					label="Уровень"
					solo
					return-object
				></v-select>
				<v-select
					v-model="emc.Publisher"
					:items="publishers"
					item-text="name"
					no-data-text="Нет данных"
					label="Издательство"
					placeholder="Выберите издательство умк"
					solo
					return-object
				></v-select>
				<v-select
					v-model="emc.Subject"
					:items="subjects"
					item-text="name"
					no-data-text="Нет данных"
					label="Предмет"
					placeholder="Выберите предмет умк"
					solo
					return-object
				></v-select>
			</v-card-text>
			<v-card-actions>
				<v-btn text color="teal accent-4" @click="createEMC"> Создать УМК </v-btn>
				<v-btn text color="red accent-2" :to="{ name: 'admin-emcs' }"> Назад </v-btn>
			</v-card-actions>
		</v-card>
	</v-container>
</template>
<script>
import { mapFields } from 'vuex-map-fields'
import AdminService from '../../services/adminService'

export default {
	data: () => ({
		error: null,
		message: null,
		emc: {
			title: null,
			grades: null,
			authors: null,
			levelId: null,
			Level: null,
			subjectId: null,
			Subject: null,
			publisherId: null,
			Publisher: null,
			isCustom: false,
		},
	}),
	computed: {
		...mapFields(['isSignin', 'user', 'publishers', 'subjects', 'levels']),
	},
	created() {
		this.activeSidebar = ''
	},
	methods: {
		async createEMC() {
			try {
				console.log('creating emc ', this.emc)
				// так как из-за vuex нам сначала надо обновить данные в хранилище
				this.$store.dispatch('createEMC', this.emc)
				await AdminService.createEMC(this.emc)

				this.$router.push({
					name: 'admin-subject-emcs',
					params: { subjectCode: this.emc.Subject.code },
				})
			} catch (error) {
				this.error = error
			}
		},
	},
}
</script>
<style scope></style>
