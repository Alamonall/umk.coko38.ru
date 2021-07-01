<template>	
  <v-container cols="9">
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
              <v-list-item-title blue>{{school.name}} ({{ school.srcApproved}}/{{ school.srcTotalEMConSchool}})</v-list-item-title>
            </v-list-item-content>
          </template>

					<v-list-group
						v-for='subject in subjects'
						:key='subject.SubjectGlobalID'
						:value="false"
						no-action
						sub-group
        		>
						<template v-slot:activator>
							<v-list-item-content>
								<v-list-item-title blue>{{subject.name}} ({{ subject.srcApproved}}/{{ subject.srcTotalEMConSchool}})</v-list-item-title>
							</v-list-item-content>
						</template>

						<v-list-item link >11 класс</v-list-item>
						<v-list-item link >9 класс</v-list-item>
					</v-list-group>          
				</v-list-group>
      </v-list-group>
		</TheSidebar>
  </v-container>
</template>

<script>
import AdminService from '../services/adminService'
import TheSidebar from '../components/TheSidebar.vue'

export default {
	components: {
		TheSidebar
	},
  data: () => ({
		areas: [],
		subjects: [],
	}),
  created() {
    this.getAdminData()
  },
	methods: {
    async getAdminData() {
      console.log('getMainData')
      try {
        const response = await AdminService.getAdminData()
        console.log(response.data)
        this.areas = response.data.areasAndSchools
				this.subjects = response.data.subjects
      } catch (error) {
        this.error = error.response.data.error
      }
    },
  },
}
</script>

<style scoped></style>
