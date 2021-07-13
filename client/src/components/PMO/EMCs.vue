<template>
	<v-row v-if="isSignin && user.UserRole.code == 2" dense>
		<v-col cols="12">
			<v-btn text color="teal accent-4" :to="{ name: 'pmo-emc-create' }"> Создать УМК </v-btn>
		</v-col>
		<v-col cols="12">
			<v-card v-if="emcsFilteredForPMO.length == 0" class="mx-auto text-center">
				Учебников по этому предмету нету
			</v-card>
		</v-col>
		<v-col cols="12">
			<v-card	
				v-for='emc in emcsFilteredForPMO'
				:key='emc.id'
				>
				<v-card-title	class='text-h4'> {{ emc.title }} </v-card-title>
				<v-card-text class='text-h5'>
					<div>
						<v-chip
							v-show='emc.isCustom && emc.createdBy === user.id'
							color="red"
							text-color="white"
							pill
							>
							Созданный вами
						</v-chip>
					</div>
					<p> <strong> Издательство: </strong>	{{ emc.Publisher.name }} </p>
					<p> <strong> Авторы: </strong>	{{ emc.authors }} </p>
					<p> <strong> Класс: </strong> {{ emc.grades }} </p>
					<p> <strong> Уровень: </strong> {{ emc.Level ? emc.Level.name : 'Нет данных' }} </p>
					<v-chip v-if='emc.gia == 9'
						color='indigo lighten-2'
						text-color='white'
						pill
					> 
						ГИА-{{ emc.gia }}
					</v-chip>
					<v-chip v-if='emc.gia == 11'
						color='light-blue accent-3'
						text-color='white'
						pill
					>
					 ГИА-{{ emc.gia }}
					</v-chip>
					<v-chip 
						color='light-blue accent-3'
						text-color='white'
						pill
					>
						{{ emc.Subject.name }}
					</v-chip>
				</v-card-text>
				<v-card-actions>
					<v-btn 
						v-if="emc.isCustom && emc.createdBy === user.id"
						text color="teal accent-4" :to="{ name: 'pmo-emc-edit', params: { emcId: emc.id } }"> Редактировать </v-btn>
					<v-spacer></v-spacer>
					<v-btn v-if="emc.isCustom && emc.createdBy === user.id"
					text color="red darken-1" @click="deleteEMC(emc)"> 
					Удалить </v-btn>
				</v-card-actions>
			</v-card>
		</v-col>
	</v-row>
</template>
<script>
import { mapFields } from 'vuex-map-fields'
import PmoService from '../../services/pmoService'

export default {
	data: () => ({
		error: null,
	}),
	computed: {
		...mapFields(['isSignin', 'user', 'emcs']),
		emcsFilteredForPMO() {
			return this.emcs.filter(emc => emc.isCustom && emc.createdBy === this.user.id)
		},
	},
	watch: {
		$route() {
			this.getEMCsForConstructor()
		},
	},
	created() {
		this.$store.dispatch('setSubjectsSidebar', true) // Включаем sidebar для EMCs
		this.$store.dispatch('setAreasSidebar', false) // На всякий случай ставим sidebar EMCsOnSchool на false
		this.getEMCsForConstructor()
	},
	methods: {
		async getEMCsForConstructor() {
			try {
				const response = await PmoService.getEMCs(this.$route.params)
				this.$store.commit('setEMCs', response.data.emcs)
			} catch (err){ this.error = err }
		},
		async deleteEMC(emc){
			try {
				const response = await PmoService.deleteEMC(emc)
				if(response.status === 200)
					this.$store.dispatch('deleteEMC', emc)
			} catch (error) {
				this.error = error
			}
		}
	},
}
</script>
<style></style>
