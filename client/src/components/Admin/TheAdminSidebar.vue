<template>
	<v-navigation-drawer app width="25%" left="true" height="100%" permanent absolute clipped>
		<v-list-group
			v-for="area in areas"
			:key="area.AreaID"
			:value="false"
			prepend-icon="mdi-account-circle"
		>
			<template v-slot:activator>
				<v-list-item-title>{{ area.name }}</v-list-item-title>
			</template>

			<v-list-group
				v-for="school in area.Schools"
				:key="school.id"
				:value="false"
				no-action
				sub-group
			>
				<template v-slot:activator>
					<v-list-item-content>
						<v-list-item-title blue>{{ school.code }} {{ school.name }} </v-list-item-title>
					</v-list-item-content>
				</template>

				<v-list-item v-for="subject in subjects" :key="subject.id" :value="false" link>
					<v-list-item-content>
						<v-btn
							plain
							@click="
								goTo({
									name: 'admin-emc-on-school',
									params: { areaId: area.id, subjectId: subject.id, schoolId: school.id },
								})
							"
						>
							{{ subject.name }}
						</v-btn>
					</v-list-item-content>
				</v-list-item>
			</v-list-group>
		</v-list-group>
	</v-navigation-drawer>
</template>

<script>
import _ from 'lodash'
import { mapFields } from 'vuex-map-fields'

export default {
	name: 'TheAdminSidebar',
	data: () => ({
		err: null,
	}),
	computed: {
		...mapFields(['subjects', 'activeRouteParams', 'areas']),
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
