<template>
	<v-container class="px-0" fluid>
		<v-card>
			<v-card-title class="text-h4"> УМК: {{ emcOnSchool.EMC.title }} </v-card-title>
			<v-card-text class="text-h5">
				<div>
					<v-chip v-show="emcOnSchool.isApproved" color="green" text-color="white" pill>
						Утверждено
					</v-chip>
					<v-chip v-show="!emcOnSchool.isApproved" color="yellow" text-color="black" pill>
						Не утверждено
					</v-chip>
					<v-chip v-show="emcOnSchool.EMC.isCustom" color="red" text-color="white" pill>
						Пользовательский
					</v-chip>
				</div>
				<p><strong>Издательство:</strong> {{ emcOnSchool.EMC.Publisher.publisherName }}</p>
				<p><strong>Авторы:</strong> {{ emcOnSchool.EMC.authors }}</p>
				<p><strong>Класс:</strong> {{ emcOnSchool.EMC.grades }}</p>
				<p><strong>Кол-во учеников:</strong> {{ emcOnSchool.studentsCount }}</p>
				<p>
					<strong>Уровень:</strong>
					{{ emcOnSchool.EMC.Level ? emcOnSchool.EMC.Level.name : 'Нет данных' }}
				</p>
			</v-card-text>
			<v-card-actions>
				<v-btn text color="teal accent-4" @click="isDetailing = !isDetailing"> Комментарии </v-btn>
				<v-btn
					text
					color="teal accent-4"
					@click="$emit('onSwapApprovingStatusEmcOnSchool', emcOnSchool)"
				>
					{{ emcOnSchool.isApproved ? 'Отменить утверждение' : 'Утвердить' }}
				</v-btn>
				<v-btn
					text
					color="teal accent-4"
					@click="
						goTo({
							name: 'admin-emc-edit',
							params: { emcId: emcOnSchool.emcId, from: 'admin-emc-on-school' },
						})
					"
				>
					Редактировать
				</v-btn>
				<v-btn
					v-if="activeRouteParams.subjectId"
					text
					color="teal accent-4"
					@click="$emit('onDetachEmcFrom', emcOnSchool)"
				>
					Открепить УМК
				</v-btn>
				<v-btn
					v-if="!activeRouteParams.subjectId"
					text
					color="teal accent-4"
					@click="$emit('onDetachEmcFrom', emcOnSchool)"
				>
					Открепить УМК от всех МО и ОО
				</v-btn>
			</v-card-actions>
			<v-expand-transition>
				<v-card v-show="isDetailing">
					<v-tabs v-model="tab" background-color="transparent" color="basil" grow>
						<v-tab>Кол-во учеников</v-tab>
						<v-tab>Причина использования</v-tab>
						<v-tab>Причина изменения</v-tab>
						<v-tab>Причина смены</v-tab>
					</v-tabs>
					<v-tabs-items v-model="tab">
						<v-tab-item>
							<v-card flat>
								<v-card-text>
									<TheEditAdditionalEOSData
										additionalEOSTitle="Кол-во учеников"
										:additionalEOSDataValue="emcOnSchool.studentsCount"
										@onSaveAdditionalData="saveStudentsCount"
										:isNumber="true"
									/>
									{{ emcOnSchool.studentsCount }}</v-card-text
								>
							</v-card>
						</v-tab-item>
						<v-tab-item>
							<v-card flat>
								<v-card-text>
									<TheEditAdditionalEOSData
										additionalEOSTitle="Причина использования"
										:additionalEOSDataValue="emcOnSchool.usingCoz"
										@onSaveAdditionalData="saveUsingCozComment"
									/>
									{{ emcOnSchool.usingCoz }}
								</v-card-text>
							</v-card>
						</v-tab-item>
						<v-tab-item>
							<v-card flat>
								<v-card-text>
									<TheEditAdditionalEOSData
										additionalEOSTitle="Причина изменения"
										:additionalEOSDataValue="emcOnSchool.correctionCoz"
										@onSaveAdditionalData="saveCorrectionCozComment"
									/>
									{{ emcOnSchool.correctionCoz }}</v-card-text
								>
							</v-card>
						</v-tab-item>
						<v-tab-item>
							<v-card flat>
								<v-card-text>
									<TheEditAdditionalEOSData
										additionalEOSTitle="Причина смены"
										:additionalEOSDataValue="emcOnSchool.swapCoz"
										@onSaveAdditionalData="saveSwapCozComment"
									/>
									{{ emcOnSchool.swapCoz }}</v-card-text
								>
							</v-card>
						</v-tab-item>
					</v-tabs-items>
				</v-card>
			</v-expand-transition>
		</v-card>
	</v-container>
</template>
<script>
import _ from 'lodash'
import { mapFields } from 'vuex-map-fields'
import TheEditAdditionalEOSData from '../TheEditAdditionalEOSData.vue'
import AdminService from '../../services/adminService'

export default {
	components: {
		TheEditAdditionalEOSData,
	},
	props: {
		emcOnSchool: {
			type: Object,
			default: null,
		},
	},
	data: () => ({
		error: null,
		tab: null,
		isDetailing: false,
	}),
	computed: {
		...mapFields(['activeRouteParams', 'isSignin', 'user', 'emcs', 'emcsOnSchool']),
	},
	methods: {
		saveUsingCozComment(comment) {
			this.updateEmcOnSchool({ usingCoz: comment })
		},
		saveCorrectionCozComment(comment) {
			this.updateEmcOnSchool({ correctionCoz: comment })
		},
		saveSwapCozComment(comment) {
			this.updateEmcOnSchool({ swapCoz: comment })
		},
		saveStudentsCount(number) {
			this.updateEmcOnSchool({ studentsCount: number })
		},
		async updateEmcOnSchool(data) {
			try {
				await AdminService.updateEmcOnSchool({
					emcOnSchoolId: this.emcOnSchool.id,
					...data,
				})
				this.activeRouteParams = { ...this.activeRouteParams }
			} catch (err) {
				this.error = err
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

<style scoped>
.v-card--reveal {
	bottom: 0;
	opacity: 1 !important;
	position: absolute;
	width: 100%;
}
</style>
