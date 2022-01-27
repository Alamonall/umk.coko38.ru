<template>
	<v-card>
		<v-card-title class="text-h5"> Добавить УМК </v-card-title>
		<v-card-text>
			<v-row>
				<v-col cols="12">
					<v-autocomplete
						v-model="model"
						:items="emcsTitles"
						no-data-text="Нет данных"
						item-text="Description"
						item-value="emc"
						dense
						solo
						hide-selected
						label="УМК"
						placeholder="Введите параметр УМК, по которому вы хотите найти нужный"
						prepend-icon="mdi-database-search"
					>
						<template v-slot:item="data">
							<v-list-item-content>
								<v-list-item-title>{{ data.item.emc.previewData['Название'] }}</v-list-item-title>
								<v-list-item-subtitle>
									<p>
										Авторы: {{ data.item.emc.previewData['Авторы'] }}; Издатель:
										{{ data.item.emc.previewData['Издатель'] }}; Классы:
										{{ data.item.emc.previewData['Классы'] }}
									</p>
								</v-list-item-subtitle>
							</v-list-item-content>
						</template>
					</v-autocomplete>
				</v-col>
			</v-row>
		</v-card-text>
		<v-expand-transition>
			<v-list v-if="model">
				<v-list-item v-for="(field, i) in fields" :key="i">
					<v-list-item-content>
						<v-list-item-title v-text="field.value"></v-list-item-title>
						<v-list-item-subtitle v-text="field.key"></v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
				<v-list-item>
					<v-text-field
						v-model="additionalDataForEMCOnSchool.studentsCount"
						type="number"
						label="Количество учеников"
					>
					</v-text-field>
				</v-list-item>
				<v-list-item>
					<v-text-field
						v-model="additionalDataForEMCOnSchool.usingCoz"
						label="Причины использования"
					>
					</v-text-field>
				</v-list-item>
				<v-list-item>
					<v-text-field v-model="additionalDataForEMCOnSchool.swapCoz" label="Причины смены">
					</v-text-field>
				</v-list-item>
				<v-list-item>
					<v-text-field
						v-model="additionalDataForEMCOnSchool.correctionCoz"
						label="Планируемая корректировка"
					>
					</v-text-field>
				</v-list-item>
			</v-list>
		</v-expand-transition>
		<v-card-actions>
			<v-btn :disabled="!model" color="teal accent-3" @click="attachEMC">
				Добавить
				<v-icon right> mdi-check </v-icon>
			</v-btn>
			<v-spacer></v-spacer>
			<v-btn :disabled="!model" color="red lighten-1" @click="model = null">
				Закрыть
				<v-icon right> mdi-close-circle </v-icon>
			</v-btn>
		</v-card-actions>
	</v-card>
</template>
<script>
import { mapFields } from 'vuex-map-fields'
import PmoService from '../../services/pmoService'

export default {
	data: () => ({
		model: null,
		additionalDataForEMCOnSchool: {
			swapCoz: null,
			usingCoz: null,
			correctionCoz: null,
			studentsCount: 0,
		},
		descriptionLimit: 200,
		error: null,
	}),
	computed: {
		...mapFields(['emcs', 'emcsOnSchool', 'user']),
		fields() {
			if (!this.model) return []
			return Object.keys(this.model.previewData).map((key) => {
				return {
					key: this.model.previewData[key],
					value: key,
				}
			})
		},
		emcsTitles() {
			return this.emcs.reduce((filtered, entry) => {
				if (
					!!entry &&
					entry.Subject.code === this.$route.params.subjectCode &&
					this.emcsOnSchool.filter(
						(eos) =>
							eos.emcId === entry.id && eos.School.schoolCode === this.$route.params.schoolCode,
					).length === 0
				) {
					const unpreparedDescription =
						entry.title.concat('. ') + entry.authors.concat('. ') + entry.Publisher.name
					const Description =
						unpreparedDescription.length > this.descriptionLimit
							? unpreparedDescription.slice(0, this.descriptionLimit).concat('...')
							: unpreparedDescription

					const emc = []
					emc.previewData = {}
					emc.previewData['Название'] = entry.title
					emc.previewData['Авторы'] = entry.authors
					emc.previewData['Издатель'] = entry.Publisher.name
					emc.previewData['Предмет'] = entry.Subject.name
					emc.previewData['Классы'] = entry.grades
					emc.previewData['Уровень'] = entry.Level.name
					emc.previewData['Создана вами'] = entry.createdBy === this.user.id ? 'Да' : 'Нет'
					emc.entry = entry
					filtered.push({ Description, emc })
				}
				return filtered
			}, [])
		},
	},
	watch: {
		$route() {
			this.model = null
			this.getEMCs()
		},
	},
	created() {
		this.getEMCs()
	},
	methods: {
		async getEMCs() {
			try {
				const response = await PmoService.getEMCs(this.$route.params)
				this.emcs = [...response.data.emcs]
			} catch (err) {
				this.error = err
			}
		},
		async attachEMC() {
			try {
				const response = await PmoService.attachTo(this.$route.params, this.model.entry.id, {
					...this.additionalDataForEMCOnSchool,
				})

				this.emcsOnSchool = [...response.data.emcsOnSchool]
				this.model = null
				this.getEMCs()
			} catch (err) {
				this.error = err
			}
		},
	},
}
</script>
<style scope></style>
