<template>
	<v-container class="px-0" fluid>
		<v-card>
			<v-card-title class="text-h4"> УМК: {{ emcOnSchool.EMC.title }} </v-card-title>
			<v-card-text class="text-h5">
				<div>
					<v-chip v-show="emcOnSchool.isApproved" color="green" text-color="white" pill>
						Подтверждено
					</v-chip>
					<v-chip v-show="!emcOnSchool.isApproved" color="yellow" text-color="black" pill>
						Не подтверждено
					</v-chip>
					<v-chip
						v-show="emcOnSchool.EMC.isCustom && emcOnSchool.EMC.createdBy === user.id"
						color="red"
						text-color="white"
						pill
					>
						Создано вами
					</v-chip>
					<v-chip v-if="emcOnSchool.EMC.gia == 9" color="indigo lighten-2" text-color="white" pill>
						ГИА-{{ emcOnSchool.EMC.gia }}
					</v-chip>
					<v-chip
						v-if="emcOnSchool.EMC.gia == 11"
						color="light-blue accent-3"
						text-color="white"
						pill
					>
						ГИА-{{ emcOnSchool.EMC.gia }}
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
					@click="$emit('onSwapApprovingStatusEMCOnSchool', emcOnSchool)"
				>
					{{ emcOnSchool.isApproved ? 'Отменить утверждение' : 'Утвердить' }}
				</v-btn>
				<v-btn
					v-if="emcOnSchool.EMC.isCustom && emcOnSchool.EMC.createdBy === user.id"
					text
					color="teal accent-4"
					:to="{ name: 'pmo-emc-edit', params: { emcId: emcOnSchool.emcId } }"
				>
					Редактировать
				</v-btn>
				<v-btn text color="teal accent-4" @click="$emit('onDetachEMCFrom', emcOnSchool)">
					Открепить УМК
				</v-btn>
			</v-card-actions>
			<v-expand-transition>
				<v-card v-show="isDetailing">
					<v-card-text class="pb-0">
						<p><strong>Причина исползования:</strong> {{ emcOnSchool.usingCoz }}</p>
						<p><strong>Причина изменений:</strong> {{ emcOnSchool.correctionCoz }}</p>
						<p><strong>Причина смены: </strong> {{ emcOnSchool.swapCoz }}</p>
					</v-card-text>
				</v-card>
			</v-expand-transition>
		</v-card>
	</v-container>
</template>
<script>
import { mapFields } from 'vuex-map-fields'

export default {
	props: {
		emcOnSchool: {
			type: Object,
			default: null,
		},
	},
	data: () => ({
		isDetailing: false,
	}),
	computed: {
		...mapFields(['isSignin', 'user', 'emcs']),
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
