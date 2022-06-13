<template>
	<v-row v-if="isSignin && user.UserRole.code == 1" dense>
		<v-col cols="12">
			<v-btn text color="teal accent-4" :to="{ name: 'admin-emc-create' }"> Создать УМК </v-btn>
		</v-col>
		<v-col cols="12">
			<v-card v-if="emcs.length === 0" class="mx-auto text-center">
				Учебников по этому предмету нету
			</v-card>
		</v-col>
		<v-col cols="12">
			<v-card v-for="emc in emcs" :key="emc.id">
				<v-card-title class="text-h4"> {{ emc.title }} </v-card-title>
				<v-card-text class="text-h5">
					<div>
						<v-chip v-show="emc.isCustom" color="red" text-color="white" pill>
							Пользовательский
						</v-chip>
					</div>
					<p><strong> Издательство: </strong> {{ emc.Publisher.name }}</p>
					<p><strong> Авторы: </strong> {{ emc.authors }}</p>
					<p><strong> Класс: </strong> {{ emc.grades }}</p>
					<p><strong> Уровень: </strong> {{ emc.Level ? emc.Level.name : 'Нет данных' }}</p>
					<v-chip v-if="emc.gia == 9" color="indigo lighten-2" text-color="white" pill>
						ГИА-{{ emc.gia }}
					</v-chip>
					<v-chip v-if="emc.gia == 11" color="light-blue accent-3" text-color="white" pill>
						ГИА-{{ emc.gia }}
					</v-chip>
					<v-chip color="light-blue accent-3" text-color="white" pill>
						{{ emc.Subject.name }}
					</v-chip>
				</v-card-text>
				<v-card-actions>
					<v-btn
						text
						color="teal accent-4"
						:to="{ name: 'admin-emc-edit', params: { emcId: emc.id } }"
					>
						Редактировать
					</v-btn>
					<v-btn
						v-if="emc.createBy"
						text
						color="teal accent-4"
						@click="swapCreatingStatusEMC('emc')"
					>
						<div v-if="emc.isCustom">Сделать официальным (не работает вроде)</div>
						<div v-else>Сделать снова пользовательским (не работает вроде)</div>
					</v-btn>
					<v-spacer></v-spacer>
					<v-btn text color="red darken-1" @click="deleteEMC(emc)"> Удалить </v-btn>
				</v-card-actions>
			</v-card>
		</v-col>
	</v-row>
</template>
<script>
import { mapFields } from 'vuex-map-fields'
import AdminService from '../../services/adminService'

export default {
	data: () => ({
		error: null,
	}),
	computed: {
		...mapFields(['isSignin', 'user', 'emcs', 'activeSidebar']),
	},
	watch: {
		$route() {
			this.getEMCsForConstructor()
		},
	},
	created() {
		this.activeSidebar = 'subjects'
		this.getEMCsForConstructor()
	},
	methods: {
		async getEMCsForConstructor() {
			try {
				const response = await AdminService.getEMCs(this.$route.params)
				this.emcs = response.data.emcs
			} catch (err) {
				this.error = err
			}
		},
		async swapCreatingStatusEMC(emc) {
			try {
				// Делаем умк официальной - что позволит добавлять её другим ПМО и ПОО
				if (emc.createdBy != null) {
					this.$store.dispatch('swapCreatingStatusEMC', emc)
				}
			} catch (error) {
				this.error = error
			}
		},
		async deleteEMC(emc) {
			try {
				console.log('deleteEMC: ', emc)
				const response = await AdminService.deleteEMC(emc)
				// THINK AGAIN
				if (response.status === 200) this.$store.dispatch('deleteEMC', emc)
			} catch (error) {
				this.error = error
			}
		},
	},
}
</script>
<style></style>
