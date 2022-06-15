<template>
	<v-navigation-drawer app width="25%" left="true" height="100%" permanent absolute clipped>
		<v-list-item v-for="subject in subjects" :key="subject.id" :value="false" link>
			<v-list-item-content>
				<v-btn
					v-if="user.UserRole.code == 1"
					plain
					@click="
						goTo({
							name: 'admin-emc',
							params: { subjectId: subject.id },
						})
					"
				>
					{{ subject.name }}
				</v-btn>
				<v-btn
					v-if="user.UserRole.code == 2"
					plain
					@click="
						goTo({
							name: 'pmo-emc',
							params: { subjectId: subject.id },
						})
					"
				>
					{{ subject.name }}
				</v-btn>
				<v-btn
					v-if="user.UserRole.code == 3"
					plain
					@click="
						goTo({
							name: 'poo-emc',
							params: { subjectId: subject.id },
						})
					"
				>
					{{ subject.name }}
				</v-btn>
			</v-list-item-content>
		</v-list-item>
	</v-navigation-drawer>
</template>

<script>
import _ from 'lodash'
import { mapFields } from 'vuex-map-fields'

export default {
	name: 'TheSubjectsSidebar',
	data: () => ({
		err: null,
	}),
	computed: {
		...mapFields(['user', 'subjects', 'activeRouteParams']),
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
