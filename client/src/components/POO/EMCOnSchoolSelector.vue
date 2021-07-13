<template>
	<v-card>
		<v-card-title class="text-h5">
			Добавить УМК
		</v-card-title>
		<v-card-text>
			<v-autocomplete
				v-model='model'
				:items='emcsTitles'
				no-data-text='Нет данных'
				item-text='Description'
				item-value='emc'
				dense
				rounded
				solo
				hide-selected
				label='УМК'
				placeholder='Введите параметр УМК, по которому вы хотите найти нужный'
				prepend-icon='mdi-database-search'
			></v-autocomplete>
		</v-card-text>
		<v-card-actions>
			<v-btn
				:disabled='!model'
				@click='attachEMC'
				color='teal accent-3'
			>
				Добавить
				<v-icon right>
					mdi-check
				</v-icon>
			</v-btn>
			<v-spacer></v-spacer>
			<v-btn
				:disabled='!model'
				@click='model = null'
				color='red lighten-1'
			>
				Закрыть
				<v-icon right>
					mdi-close-circle
				</v-icon>
			</v-btn>
		</v-card-actions>
		<v-divider></v-divider>
		<v-expand-transition>
			<v-list
				v-if='model'
			>
				<v-list-item
					v-for="(field, i) in fields"
					:key="i"
				>
					<v-list-item-content>
						<v-list-item-title v-text="field.value"></v-list-item-title>
						<v-list-item-subtitle v-text="field.key"></v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-expand-transition>		
	</v-card>
</template>
<script>
import { mapFields } from 'vuex-map-fields'
import PooService from '../../services/pooService'

export default {
	data: () => ({
		model: null,
		descriptionLimit: 200,
		error: null,
	}),
	watch: {
		$route(){
			this.model = null
			this.getEMCs()
		},
	},
	computed: {
		...mapFields(['emcs', 'emcsOnSchool']),	
		fields () {
			if (!this.model) return []
			return Object.keys(this.model.previewData).map(key => {
				return {
					key: this.model.previewData[key],
					value: key 
				}
			})
		},
		emcsTitles() {
			return this.emcs.reduce( (filtered, entry ) => {
				if(!!entry && entry.Subject.code === this.$route.params.subjectCode 
					&&  this.emcsOnSchool.filter( eos => eos.emcId === entry.id && eos.School.schoolCode === this.$route.params.schoolCode).length === 0) {
					const unpreparedDescription = entry.title.concat('. ') + entry.authors.concat('. ') + entry.Publisher.name
					const Description = unpreparedDescription.length > this.descriptionLimit
						? unpreparedDescription.slice(0, this.descriptionLimit).concat('...')
						: unpreparedDescription

					const emc = []
					emc.previewData = {}
					emc.previewData['Название'] = entry.title
					emc.previewData['Авторы'] = entry.authors
					emc.previewData['Издатель'] = entry.Publisher.name
					emc.previewData['Предмет'] = entry.Subject.name
					emc.previewData['Классы'] = entry.grades
					emc.previewData['Уровень'] = entry.gia
					emc.previewData['Пользовательская'] = entry.isCustom ? 'Да' : 'Нет'	
					emc.entry = entry
					filtered.push({ Description, emc })
				}
				return filtered
			}, [])
		},
	},
	created() {
		this.getEMCs()
	},
	methods: {
		async getEMCs() {
			try {
				const response = await PooService.getEMCs(this.$route.params)

				this.emcs = [...response.data.emcs]

			} catch (err) { this.error = err}
		},
		async attachEMC(){
			try {
				const response = await PooService.attachTo(this.$route.params, this.model.entry.id)

				this.emcsOnSchool = [...response.data.emcsOnSchool]
				this.model = null
				// this.getEMCs()
			} catch (err){ this.error = err }
		}
	}
}
</script>
<style scope>
	
</style>