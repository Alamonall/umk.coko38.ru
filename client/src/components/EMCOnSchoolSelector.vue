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
        @click='emitAttachingEMC'
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

export default {
	props: ['emcs'],
	data: () => ({
		model: null,
		descriptionLimit: 200,
		error: null
	}),
	watch: {
		$route(){
			this.model = null
		}
	},
	computed: {
		fields () {
			if (!this.model) return []
			return Object.keys(this.model.previewData).map(key => {
				return {
					key: this.model.previewData[key],
					value: key 
				}
			})
		},
		emcsTitles () {
			return this.emcs.map((entry) => {
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
				return { Description, emc}
			})
		}
	},
	methods: {
		emitAttachingEMC(){
			this.$emit('onAttachEMCTo', this.model)
			this.model = null
		}
	}
}
</script>
<style scope>
	
</style>