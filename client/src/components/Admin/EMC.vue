<template>
	<v-row v-if="isSignin && user.UserRole.code == 1" dense>
		<v-col cols="12">
			<h1 class="text-center">{{ subjectTitle }}</h1>
		</v-col>
		<v-col cols="12">
			<v-btn text color="teal accent-4" @click="goTo({ name: 'admin-emc-create' })">
				Создать УМК
			</v-btn>
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
						@click="goTo({ name: 'admin-emc-edit', params: { emcId: emc.id, from: 'admin-emc' } })"
					>
						Редактировать
					</v-btn>
					<v-btn
						v-if="emc.createBy"
						text
						color="teal accent-4"
						@click="swapCreatingStatusEmc('emc')"
					>
						<div v-if="emc.isCustom">Сделать официальным (не работает вроде)</div>
						<div v-else>Сделать снова пользовательским (не работает вроде)</div>
					</v-btn>
					<v-spacer></v-spacer>
					<v-btn text color="red darken-1" @click="deleteEmc({ emc })"> Удалить </v-btn>
				</v-card-actions>
			</v-card>
		</v-col>
		<v-col cols="12">
			<v-pagination v-model="page" :length="totalPages"></v-pagination>
		</v-col>
	</v-row>
</template>
<script>
import _ from 'lodash'
import { mapFields } from 'vuex-map-fields'
import AdminService from '../../services/adminService'

export default {
	data: () => ({
		error: null,
		page: 1,
		totalPages: 1,
		limit: 10,
	}),
	computed: {
		...mapFields(['subjects', 'isSignin', 'user', 'emcs', 'activeRouteParams', 'activeSidebar']),
		routeParams() {
			return this.activeRouteParams
		},
		subjectTitle() {
			return (
				this.subjects.find((subject) => subject.id === this.activeRouteParams?.subjectId)?.name ??
				'Все предметы'
			)
		},
	},
	watch: {
		routeParams() {
			this.getEmcForConstructor()
		},
		page() {
			this.getEmcForConstructor()
		},
	},
	created() {
		this.activeSidebar = 'subjects'
		this.getEmcForConstructor()
	},
	methods: {
		async getEmcForConstructor() {
			try {
				const response = await AdminService.getEmc({
					...this.activeRouteParams,
					skip: (this.page - 1) * this.limit,
					limit: this.limit,
				})
				console.log({
					msg: 'response: ',
					emcs: response.data.emcs,
					totalEmcs: response.data.totalEmcs,
				})
				this.emcs = response.data.emcs
				this.totalPages = Math.ceil(response.data.totalEmcs / this.limit)
			} catch (err) {
				this.error = err
			}
		},
		async swapCreatingStatusEmc(emc) {
			try {
				// Делаем умк официальной - что позволит добавлять её другим ПМО и ПОО
				if (emc.createdBy != null) {
					await AdminService.updateEmc({ ...this.activeRouteParams, emc })
					this.activeRouteParams = { ...this.activeRouteParams }
				}
			} catch (error) {
				this.error = error
			}
		},
		async deleteEmc({emc}) {
			try {
				await AdminService.deleteEmc({ emcId: emc.id })
				const { emcId, ...rest } = this.activeRouteParams
				this.activeRouteParams = { ...rest }
			} catch (error) {
				this.error = error
			}
		},
		goTo({ name, params }) {
			if (!_.isEqual(this.activeRouteParams, params)) {
				this.activeRouteParams = { ...this.activeRouteParams, ...params }
				this.$router.push({ name }).catch((err) => {
					// Ignore the vuex err regarding  navigating to the page they are already on.
					if (
						err.name !== 'NavigationDuplicated' &&
						!err.message.includes('Avoided redundant navigation to current location')
					) {
						// But print any other errors to the console
						console.log(err)
					}
				})
			}
		},
	},
}
</script>
<style></style>
