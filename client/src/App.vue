<template>
  <v-app>
		<PageHeader/>		
		<TheSidebar>
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
							<v-list-item-title blue>{{school.code}} {{school.name}} ({{ school.srcApproved}}/{{ school.srcTotalEMConSchool}})</v-list-item-title>
						</v-list-item-content>
					</template>

					<v-list-item
						v-for='subject in subjects'
						:key='subject.SubjectGlobalID'
						:value="false"
						link
						>
						<v-list-item-content>
							<v-btn
								plain
								:to="{ 
									name: 'admin-view-emcs', 
									params: {
										areaCode: area.code,
										schoolCode: school.code,
										subjectCode: subject.code
									}
								}"
								> {{subject.name}}</v-btn>
						</v-list-item-content>
					</v-list-item>          
				</v-list-group>
			</v-list-group>
		</TheSidebar>
    <v-main>
			<!-- Provides the application the proper gutter -->
			<v-container fluid>
      	<!-- If using vue-router -->
      	<router-view></router-view>
    	</v-container>
    </v-main>
		<!-- FOOTER -->
  </v-app>
</template>

<script>
// import { mapState } from 'vuex'
import AdminService from './services/adminService'
import PageHeader from './components/TheHeader.vue'
import TheSidebar from './components/TheSidebar.vue'

export default {
  name: 'App',
  components: {
		PageHeader,
		TheSidebar
	},
  data: () => ({
		areas: [],
		subjects: [],
		err: null
  }),
	created() {
		this.fetchData()
	},
	watch: {
		$route(to, from) {
      // обрабатываем изменение параметров маршрута...
			console.log(from)
			console.log(to)
			
			this.fetchData()
    }
	},
	methods: {
		async fetchData () {
			try {
				const response = await AdminService.getAdminData()
				console.log(response.data)
				this.areas = response.data.areasAndSchools
				this.subjects = response.data.subjects
			} catch (err) {
				console.error(err)
				this.err = err
			}
		},
	}
}
</script>
