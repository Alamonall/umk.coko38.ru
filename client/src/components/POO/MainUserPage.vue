<template>
	<v-row v-if="isSignin && user.UserRole.code == 3">
		<v-col> POO </v-col>
	</v-row>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import PooService from '../../services/pooService'

export default {
	computed: {
		...mapFields(['isSignin', 'user', 'activeSidebar', 'subjects', 'levels', 'publishers']),
	},
	created() {
		this.init()
	},
	methods: {
		async init() {
			try {
				const response = await PooService.getUserData()
				this.subjects = response.data.subjects
				this.publishers = response.data.publishers
				this.levels = response.data.levels
				this.activeSidebar = null
			} catch (err) {
				this.err = err
			}
		},
	},
}
</script>

<style scoped></style>
