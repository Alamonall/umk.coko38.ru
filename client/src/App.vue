<template>
  <v-app>
		<PageHeader/>		
		<TheSidebar 
			v-if='!this.$store.state.isSidebarActive 
				&& this.$store.state.isSignin'>
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
							<v-list-item-title blue>{{school.code}} {{school.name}} </v-list-item-title>
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
								v-if='this.$store.state.user.UserRole.code == 1'
								plain
								:to="{ 
									name: 'admin-emcs-on-school', 
									params: {
										areaCode: area.code,
										schoolCode: school.code,
										subjectCode: subject.code
									}
								}"
								>
								{{subject.name}} 
							</v-btn>
							<v-btn
								v-if='this.$store.state.user.UserRole.code == 2'
								plain
								:to="{ 
									name: 'pmo-emcs-on-school', 
									params: {
										areaCode: area.code,
										schoolCode: school.code,
										subjectCode: subject.code
									}
								}"
								>
								{{subject.name}} 
							</v-btn>
							<v-btn
								v-if='this.$store.state.user.UserRole.code == 3'
								plain
								:to="{ 
									name: 'poo-emcs-on-school', 
									params: {
										areaCode: area.code,
										schoolCode: school.code,
										subjectCode: subject.code
									}
								}"
								>
								{{subject.name}} 
							</v-btn>
						</v-list-item-content>
					</v-list-item>          
				</v-list-group>
			</v-list-group>
		</TheSidebar>

		<TheSidebar 
			v-if='this.$store.state.isSidebarActive 
				&& this.$store.state.isSignin '>
			<v-list-item
				v-for='subject in subjects'
				:key='subject.SubjectGlobalID'
				:value="false"
				link
				>
				<v-list-item-content>
					<v-btn
						v-if='this.$store.state.user.UserRole.code == 1'
						plain
						:to="{ 
							name: 'admin-subject-emcs', 
							params: {
								subjectCode: subject.code
							}
						}"
						> 
						{{subject.name}} 
					</v-btn>
					<v-btn
						v-if='this.$store.state.user.UserRole.code == 2'
						plain
						:to="{ 
							name: 'pmo-subject-emcs', 
							params: {
								subjectCode: subject.code
							}
						}"
						> 
						{{subject.name}} 
					</v-btn>
					<v-btn
						v-if='this.$store.state.user.UserRole.code == 3'
						plain
						:to="{ 
							name: 'poo-subject-emcs', 
							params: {
								subjectCode: subject.code
							}
						}"
						> 
						{{subject.name}} 
					</v-btn>
				</v-list-item-content>
			</v-list-item> 
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
import PageHeader from './components/TheHeader.vue'
import TheSidebar from './components/TheSidebar.vue'

export default {
  name: 'App',
  components: {
		PageHeader,
		TheSidebar
	},
  data: () => ({
		err: null
  }),
	computed: {
		subjects(){
			return this.$store.state.subjects
		},
		areas() {
			return this.$store.state.areas
		}
	},
}
</script>
