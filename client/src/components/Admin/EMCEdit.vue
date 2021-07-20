<template>
	<v-container v-if="isSignin && user.UserRole.code == 1" class="px-0" fluid>
		<v-card v-if="emc == null">
			<v-card-title class="text-h4 text-center">
				Подождите...Данные либо грузятся, либо произошла ошибка. <br />
				Попробуйте перезайти и попробовать снова
			</v-card-title>
		</v-card>
		<v-card v-if="emc != null">
			<v-card-title class="text-h4"> Редактирование УМК </v-card-title>
			<v-card-text class="text-h5">
				<v-text-field v-model="emc.title" label="Название"></v-text-field>
				<v-text-field v-model="emc.authors" label="Авторы"></v-text-field>
				<v-text-field v-model="emc.grades" label="Класс"></v-text-field>
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
				<v-checkbox
					v-if="emc.createdBy"
					v-model="emc.isCustom"
					label="Пользовательский"
				></v-checkbox>
			</v-card-text>
			<v-card-actions>
				<v-btn text color="teal accent-4" @click="saveEMC"> Сохранить изменения </v-btn>
				<v-spacer></v-spacer>
				<v-btn text color="red accent-2" :to="{ name: 'admin-emcs' }">
					Отменить редактирование
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-container>
</template>
<script>
import { mapFields } from 'vuex-map-fields'
import AdminService from '../../services/adminService'

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
		this.getEMCForEdit()
	},
	methods: {
		async getEMCForEdit() {
			try {
				const response = await AdminService.getEMCs(this.$route.params)
				if (response.data.error === undefined) {
					const [localEMC] = response.data.emcs
					this.emc = localEMC
				} else {
					this.$router.push({
						name: 'admin-subject-emcs',
						params: { subjectCode: this.emc.Subject.code },
					})
				}
			} catch (err) {
				this.error = err
			}
		},
		async saveEMC() {
			try {
				console.log('save this.emc : ', this.emc)
				const response = await AdminService.setEMC({
					...this.emc,
					publisherId: this.emc.Publisher.id,
					levelId: this.emc.Level.id,
					subjectId: this.emc.Subject.id,
				})
				this.$store.dispatch('updateEMC', response.data.emc)
				console.log('save emc : ', response)
				this.$router.push({
					name: 'admin-subject-emcs',
					params: { subjectCode: response.data.emc.Subject.code },
				})
			} catch (err) {
				this.error = err
			}
		},
	},
}
</script>
<style scope></style>
