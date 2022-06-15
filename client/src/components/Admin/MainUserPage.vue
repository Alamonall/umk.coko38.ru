<template>
	<v-row v-if="isSignin && user.UserRole.code == 1">
		<v-col> Admin </v-col>
	</v-row>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import AdminService from '../../services/adminService'

export default {
	computed: {
		...mapFields([
			'isSignin',
			'user',
			'activeSidebar',
			'subjects',
			'levels',
			'areas',
			'publishers',
		]),
	},
	created() {
		this.init()
		// Отключаем sidebar для страницы пользователя
		this.activeSidebar = null
	},
	methods: {
		async init() {
			try {
				const response = await AdminService.getUserData()
				this.subjects = response.data.subjects
				this.publishers = response.data.publishers
				this.levels = response.data.levels
				this.areas = response.data.areas
			} catch (err) {
				this.err = err
			}
		},
	},
}
</script>

<style scoped></style>
