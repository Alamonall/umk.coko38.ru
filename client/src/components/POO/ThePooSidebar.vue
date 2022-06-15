<template>
	<v-navigation-drawer app width="25%" left="true"  height="100%" permanent absolute clipped>
		<v-list dense>
			<v-subheader>Предметы</v-subheader>
			<v-list-item v-for="subject in subjects" :key="subject.id">
				<v-list-item-content>
					<v-btn
						plain
						@click="goTo({ name: 'poo-emc-on-school', params: { subjectId: subject.id } })"
					>
						{{ subject.name }}
					</v-btn>
				</v-list-item-content>
			</v-list-item>
		</v-list>
	</v-navigation-drawer>
</template>

<script>
import _ from 'lodash'
import { mapFields } from 'vuex-map-fields'

export default {
	name: 'ThePooSidebar',
	data: () => ({
		err: null,
	}),
	computed: {
		...mapFields(['subjects', 'activeRouteParams']),
	},
	methods: {
		goTo({ name, params }) {
			console.debug({ msg: 'goTo', name, params })
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

<style scoped></style>
