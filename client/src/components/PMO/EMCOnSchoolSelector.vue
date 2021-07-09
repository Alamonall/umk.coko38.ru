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
import PmoService from '../../services/pmoService'

export default {
	data: () => ({
		model: null,
		descriptionLimit: 200,
		error: null,
		emcsTitles: [],
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
	},
	created() {
		this.getEMCs()
	},
	methods: {
		async getEMCs() {
			try {
				console.log('get emcs')

				const response = await PmoService.getEMCs(this.$route.params)

				console.log('new emcs ', response.data.emcs)
				// this.$store.commit('setEMCs', response.data.emcs)
				this.emcs = [...response.data.emcs]

				this.getEMCsTitles()
			} catch (err) { this.error = err}
		},
		getEMCsTitles() {
			console.log('this.emcs: ', this.emcs)
			console.log('this.emcsOnSchool: ', this.emcsOnSchool)

			const emcT = this.emcs.reduce( (filtered, entry ) => {
				if(entry.Subject.code === this.$route.params.subjectCode 
					&& this.emcsOnSchool.filter( eos => eos.emcId === entry.id).length === 0) {
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

			console.log('emcsTitles: ', emcT)

			this.emcsTitles = [...emcT]
		},
		async attachEMC(){
			try {
				const response = await PmoService.attachTo(this.$route.params, this.model.entry.id)

				console.log('get response: ', response.data.emcsOnSchool)

				this.emcsOnSchool = response.data.emcsOnSchool
				// this.$emit('onAttachEMCTo', this.model)
				this.model = null
				this.getEMCs()
			} catch (err){ this.error = err }
		}
	}
}
</script>
<style scope>
	
</style>