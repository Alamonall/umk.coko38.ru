<template>
	<v-app>
		<PageHeader />
		<TheAdminSidebar v-if="activeSidebar === 'admin' && user.UserRole.code === 1 && isSignin" />
		<ThePmoSidebar v-if="activeSidebar === 'pmo' && user.UserRole.code === 2 && isSignin" />
		<ThePooSidebar v-if="activeSidebar === 'poo' && user.UserRole.code === 3 && isSignin" />
		<TheSubjectsSidebar v-if="activeSidebar === 'subjects' && isSignin" />

		<v-main>
			<!-- Provides the application the proper gutter -->
			<v-container fluid>
				<!-- If using vue-router -->
				<router-view></router-view>
			</v-container>
		</v-main>
		<TheFooter />
	</v-app>
</template>

<script>
import _ from 'lodash'
import { mapFields } from 'vuex-map-fields'
import PageHeader from './components/TheHeader.vue'
import TheAdminSidebar from './components/admin/TheAdminSidebar.vue'
import ThePmoSidebar from './components/pmo/ThePmoSidebar.vue'
import ThePooSidebar from './components/poo/ThePooSidebar.vue'
import TheSubjectsSidebar from './components/TheSubjectsSidebar.vue'
import TheFooter from './components/TheFooter.vue'

export default {
	name: 'App',
	components: {
		PageHeader,
		TheAdminSidebar,
		ThePmoSidebar,
		ThePooSidebar,
		TheSubjectsSidebar,
		TheFooter,
	},
	data: () => ({
		err: null,
	}),
	computed: {
		...mapFields(['isSignin', 'user', 'activeSidebar', 'subjects', 'areas', 'activeRouteParams']),
	},
	created() {
		document.title = 'АИС «УМК»'
	},
	methods: {
		goTo({ name, params }) {
			if (!_.isEqual(this.activeRouteParams, params)) {
				this.activeRouteParams = params
				this.$router.push({ name }).catch((err) => {
					// Ignore the vuex err regarding  navigating to the page they are already on.
					if (
						err.name !== 'NavigationDuplicated' &&
						!err.message.includes('Avoided redundant navigation to current location')
					) {
						// But print any other errors to the console
						console.log(err)
					}
				})
			}
		},
	},
}
</script>
