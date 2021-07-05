<template>
	<v-row dense v-if='this.$store.state.isSignin && this.$store.state.user.UserRole.code == 1' >
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
			<EMCCard
				v-for='emc in emcs'
				:key='emc.id'
				:emc='emc'
				@onDeleteEMC='deleteEMC'
				@onSwapCreatingStatusEMC='swapCreatingStatusEMC'
			/>
		</v-col>
	</v-row>
</template>
<script>
import { mapState } from 'vuex'
import AdminService from '../services/adminService'
import EMCCard from '../components/EMCCard.vue' 

export default {
	components: {
		EMCCard
	},
	data: () => ({
		emcs: [],
		error: null,
	}),
	created() {
		this.$store.dispatch('setSidebar', true) // Выключаем sidebar для EMCsOnSchool и включаем для конструктора
		this.getEMCsForConstructor()
	},
	computed: {
		 ...mapState([
    	'store',
      'isUserLoggedIn',
			'isSidebarActive',
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
				const response = await AdminService.getEMCs(this.$route.params)
				this.emcs = response.data.emcs
			} catch (err){ this.error = err }
		},
		async swapCreatingStatusEMC(emcOnSchool){
			try {
				// Делаем умк официальной - что позволит добавлять её другим ПМО и ПОО
				
				emcOnSchool.EMC.isCustom = !emcOnSchool.EMC.isCustom

				const response = await AdminService.setEMC(emcOnSchool.EMC)

				this.$set(this.emcs, this.emcs.indexOf(emcOnSchool.EMC), response.data.emc[0] )
			} catch (error) {
				this.error = error
			}
		},
		async deleteEMC(emc){
			try {
				console.log('emc = ' , emc)
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