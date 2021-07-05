<template>
  <v-row v-if='this.$store.state.isSignin && this.$store.state.user.UserRole.code == 1' >
		<v-col>
			Admin	{{this.$store.state.user.UserRole}}
		</v-col>
	</v-row>
</template>

<script>
import { mapState } from 'vuex' 
import AdminService from '../services/adminService'

export default {
	components: {
		
	},
  data: () => ({
	
	}),
	created() {
		this.getMainData()
	},
	computed: {
    ...mapState([
			'store',
      'isUserLoggedIn',
			'isSidebarActive',
			'user'
    ])
  },
	methods: {
		async getMainData () {
			try {
				const response = await AdminService.getAdminData()
				
				this.$store.dispatch('setAreas', response.data.areasAndSchools)
				this.$store.dispatch('setSubjects', response.data.subjects)
				this.$store.dispatch('setPublishers', response.data.publishers)
				this.$store.dispatch('setLevels', response.data.levels)
			} catch (err) {
				this.err = err
			}
		}
	}
}
</script>

<style scoped></style>
