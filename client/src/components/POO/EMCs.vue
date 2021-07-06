<template>
	<v-row dense v-if='isSignin && user.UserRole.code == 3' >
		<v-col cols="12">
			<v-btn text
				color="teal accent-4"
				:to="{ name: 'poo-emc-create' }"
				>
				Создать УМК
			</v-btn>
		</v-col>
		<v-col cols="12">
			<v-card v-if='emcs.length === 0'
				class="mx-auto text-center"
			>
			Учебников по этому предмету созданных вами нету
			</v-card>
		</v-col>
		<v-col cols="12">
			<v-card	
				v-for='emc in emcs'
				:key='emc.id'
				>
				<v-card-title  class='text-h4'> {{ emc.title }} </v-card-title>
				<v-card-text class='text-h5'>
					<div>
						<v-chip
							v-show='emc.isCustom'
							color="red"
							text-color="white"
							pill
							>
							Пользовательский
						</v-chip>
					</div>
					<p> <strong> Издательство: </strong>  {{ emc.Publisher.name }} </p>
					<p> <strong> Авторы: </strong>  {{ emc.authors }} </p>
					<p> <strong> Класс: </strong> {{ emc.grades }} </p>
				</v-card-text>
				<v-card-actions>
					<v-btn 
						text
						color="teal accent-4"
						:to="{ name: 'poo-emc-edit', params: { emcId: emc.id } }"
						>
						Редактировать
					</v-btn>
					<v-spacer></v-spacer>
					<v-btn
						text
						color="red darken-1"
						@click="deleteEMC('emc')"
						>
						Удалить
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-col>
	</v-row>
</template>
<script>
import { mapState } from 'vuex'
import PooService from '../../services/pooService'

export default {
	data: () => ({
		emcs: [],
		error: null,
	}),
	created() {
		this.$store.dispatch('setSubjectsSidebar', true) // Включаем sidebar для EMCs
		this.$store.dispatch('setAreasSidebar', false) // На всякий случай ставим sidebar EMCsOnSchool на false
		this.getEMCsForConstructor()
	},
	computed: {
		 ...mapState([
    	'isSignin',
			'user'
    ])
  },
	watch: {
		$route() {
			this.getEMCsForConstructor()
		}
	},
	methods: {
		async getEMCsForConstructor() {
			try {
				const response = await PooService.getEMCs(this.$route.params)
				this.emcs = response.data.emcs.filter(emc => emc.isCustom && (emc.createdBy === this.$store.state.user.id))
			} catch (err){ this.error = err }
		},
		async deleteEMC(emc){
			try {
				const response = await PooService.deleteEMC(emc)
				this.message = response.data.message
				this.$store.dispatch('removeFromEMCsToAttach', emc)
				
				this.emcs.splice(this.emcs.indexOf(emc),1)
			} catch (err) {
				this.error = err				
			}
		}
	}
}
</script>
<style>
	
</style>