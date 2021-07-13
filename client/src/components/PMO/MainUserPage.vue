<template>
	<v-row v-if="isSignin && user.UserRole.code == 2">
		<v-col> PMO </v-col>
	</v-row>
</template>

<script>
import { mapState } from 'vuex'
import PmoService from '../../services/pmoService'

export default {
	computed: {
		...mapState(['isSignin', 'user']),
	},
	created() {
		this.getUserData()
		this.$store.dispatch('setSubjectsSidebar', false)
		this.$store.dispatch('setAreasSidebar', false)
	},
	methods: {
		async getUserData() {
			try {
				const response = await PmoService.getUserData()
				
				this.$store.dispatch('setAreas', response.data.areasAndSchools)
				this.$store.dispatch('setSubjects', response.data.subjects)
				this.$store.dispatch('setPublishers', response.data.publishers)
				this.$store.dispatch('setLevels', response.data.levels)
				this.$store.dispatch('setEMCs', response.data.emcs)
				
			} catch (err) {
				this.err = err
			}
		},
	},
}
</script>
<style scoped></style>
