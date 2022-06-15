<template>
	<v-row v-if="isSignin && user.UserRole.code == 2">
		<v-col> PMO </v-col>
	</v-row>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import PmoService from '../../services/pmoService'

export default {
	computed: {
		...mapFields(['isSignin', 'user', 'schools','subjects','levels','publishers','activeSidebar']),
	},
	created() {
		this.init()
		// Отключаем sidebar для страницы пользователя
		this.activeSidebar = null
	},
	methods: {
		async init() {
			try {
				const response = await PmoService.getUserData()
				this.schools = response.data.schools
				this.subjects = response.data.subjects
				this.publishers = response.data.publishers
				this.levels = response.data.levels
			} catch (err) {
				this.err = err
			}
		},
	},
}
</script>
<style scoped></style>
