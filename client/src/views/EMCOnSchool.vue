<template>
	<v-row dense>
		<v-col cols="12"
			v-show='!editingMode'
			>
			<EMCOnSchoolCard
				v-for='emcOnSchool in emcsOnSchool'
				:key='emcOnSchool.id'
				>
				<template v-slot:emc-title>  УМК: {{ emcOnSchool.EMC.title }}  </template>
				<template v-slot:emc-main-info>
					<p> Издательство: {{ emcOnSchool.EMC.Publisher.publisherName }}</p>
					<p> Авторы: {{ emcOnSchool.EMC.authors }}</p>
					<p> Класс: {{ emcOnSchool.EMC.grades }}</p>
					<p> Кол-во учеников: {{ emcOnSchool.studentsCount }} </p>
					<p v-if='emcOnSchool.isApproved'> Подтверждено </p>
				</template>
				<template v-slot:emc-additional-info>
					<p><strong>Причина исползования:</strong> {{ emcOnSchool.usingCoz }}</p>
					<p><strong>Причина изменений:</strong>  {{ emcOnSchool.correctionCoz }} </p>
					<p><strong>Причина смены: </strong> {{ emcOnSchool.swapCoz }} </p>
				</template>
				<template v-slot:user-actions>
					<v-btn text color="teal accent-4"
						:to="{ name: 'admin-emc-edit', params: { emcId: emcOnSchool.emcId }}"
						>
						Редактировать
					</v-btn>
					<v-btn text color="teal accent-4"
						v-if='emcOnSchool.EMC.isCustom' 
						:to="{ name: 'admin-emc-make-official', params: {emcId: emcOnSchool.emcId }}"
						>
						Сертифицировать
					</v-btn>
					<v-btn text color="teal accent-4"
						v-if='emcOnSchool.EMC.createdBy != null && !emcOnSchool.EMC.isCustom'
						:to="{ name: 'admin-emc-make-custom', params: {emcId: emcOnSchool.emcId }}"
						>
						Убрать сертификацию
					</v-btn>
				</template>
			</EMCOnSchoolCard>
		</v-col>
		<v-col cols='12'
			v-show='editingMode'
			>
			<EMCOnSchoolEditCard>
			</EMCOnSchoolEditCard>
		</v-col>	
	</v-row>
</template>

<script>
// import { mapState } from 'vuex'
import AdminService from '../services/adminService'
import EMCOnSchoolCard from '../components/EMCOnSchoolCard.vue'
import EMCOnSchoolEditCard from '../components/EMCOnSchoolEditCardEdit.vue'

export default {
	components: {
		EMCOnSchoolCard,
		EMCOnSchoolEditCard
	},
  data() {
    return {
			emcsOnSchool: [],
			editingMode: false,
			err: null
    }
  },
	watch: {
    $route(to, from) {
      // обрабатываем изменение параметров маршрута...
			console.log(from)
			console.log(to)
			this.getEMCsOnSchool()
    }
  },
	created() {
		this.getEMCsOnSchool()
	},
	methods: {
		async getEMCsOnSchool() {
			try {
				const { areaCode, schoolCode, subjectCode } = this.$route.params
				const response = await AdminService.getEMCs(areaCode, schoolCode, subjectCode)
				console.log(response.data.emcs)
				this.emcsOnSchool = response.data.emcs
			} catch (err) { 
				console.error(err)
				this.err = err
			}
		}
	},
}
</script>
<style scoped></style>
