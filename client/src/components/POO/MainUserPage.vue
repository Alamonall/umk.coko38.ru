<template>
	<v-row v-if="isSignin && user.UserRole.code == 3">
		<v-col> POO </v-col>
	</v-row>
</template>

<script>
import { mapState } from 'vuex'
import PooService from '../../services/pooService'

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
				const response = await PooService.getUserData()
				this.$store.dispatch('setAreas', response.data.areasAndSchools)
				this.$store.dispatch('setSubjects', response.data.subjects)
				this.$store.dispatch('setPublishers', response.data.publishers)
				this.$store.dispatch('setLevels', response.data.levels)
				this.$store.dispatch('setEMCs', response.data.emcsToAttach)
			} catch (err) {
				this.err = err
			}
		},
	},
}
</script>

<style scoped></style>
