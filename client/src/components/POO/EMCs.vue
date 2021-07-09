<template>
	<v-row v-if='isSignin && user.UserRole.code == 3' dense>
		<v-col cols="12">
			<v-btn text
				color="teal accent-4"
				:to="{ name: 'poo-emc-create' }"
				>
				Создать УМК
			</v-btn>
		</v-col>
		<v-col cols="12">
			<v-card 
				v-if='emcsFilter.length === 0'
				class="mx-auto text-center"
			>
			Учебников по этому предмету созданных вами нету
			</v-card>
		</v-col>
		<v-col cols="12">
			<v-card	
				v-for='emc in emcsFilter'
				:key='emc.id'
				>
				<v-card-title	class='text-h4'> {{ emc.title }} </v-card-title>
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
					<p> <strong> Издательство: </strong>	{{ emc.Publisher.name }} </p>
					<p> <strong> Авторы: </strong>	{{ emc.authors }} </p>
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
import { mapState, mapActions } from 'vuex'
import PooService from '../../services/pooService'

export default {
	data: () => ({
		error: null,
	}),	
	computed: {
		 ...mapState([
			'isSignin',
			'user'
		]),
		...mapActions([
			'deleteEMC'
		]),
		emcsFilter(){
			return this.$store.state.emcs.filter(emc => emc.isCustom && (emc.createdBy === this.$store.state.user.id))
		}
	},
	watch: {
		$route() {
			this.getEMCsForConstructor()
		}
	},
	created() {
		this.$store.dispatch('setSubjectsSidebar', true) // Включаем sidebar для EMCs
		this.$store.dispatch('setAreasSidebar', false) // На всякий случай ставим sidebar EMCsOnSchool на false
		this.getEMCsForConstructor()
	},
	methods: {
		async getEMCsForConstructor() {
			try {
				const response = await PooService.getEMCs(this.$route.params)
				this.$store.dispatch('setEMCs', response.data.emcs)
			} catch (err){ this.error = err }
		}
	}
}
</script>
<style>
	
</style>