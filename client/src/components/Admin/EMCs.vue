<template>
	<v-row dense v-if='isSignin && user.UserRole.code == 1' >
		<v-col cols="12">
			<v-btn text
				color="teal accent-4"
				:to="{ name: 'admin-emc-create' }"
				>
				Создать УМК
			</v-btn>
		</v-col>
		<v-col cols="12">
			<v-card v-if='emcs.length === 0'
				class="mx-auto text-center"
			>
			Учебников по этому предмету нету
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
						:to="{ name: 'admin-emc-edit', params: { emcId: emc.id } }"
						>
						Редактировать
					</v-btn>
					<v-btn 
						v-if='emc.createBy'
						text
						color="teal accent-4"
						@click="swapCreatingStatusEMC('emc')"
						>
						<div v-if='emc.isCustom'>Сделать официальным (не работает вроде)</div>
						<div v-else>Сделать снова пользовательским (не работает вроде) </div>						
					</v-btn>
					<v-spacer></v-spacer>
					<v-btn 
						text
						color="red darken-1"
						@click="deleteEMC(emc)"
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
import AdminService from '../../services/adminService'

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
			'user',
    ]),	
  },
	watch: {
		$route() {
			this.getEMCsForConstructor()
		}
	},
	methods: {
		async getEMCsForConstructor() {
			try {
				const response = await AdminService.getEMCs(this.$route.params)
				this.emcs = response.data.emcs
			} catch (err){ this.error = err }
		},
		async swapCreatingStatusEMC(emc){
			try {
				// Делаем умк официальной - что позволит добавлять её другим ПМО и ПОО
				
				emc.isCustom = !emc.isCustom

				const response = await AdminService.setEMC(emc)

				this.$set(this.emcs, this.emcs.indexOf(emc), response.data.emc[0] )
			} catch (error) {
				this.error = error
			}
		},
		async deleteEMC(emc){
			try {
				console.log(emc)
				const response = await AdminService.deleteEMC(emc)
				this.message = response.data.message
				
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