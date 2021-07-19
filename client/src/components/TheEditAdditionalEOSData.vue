<template>
	<v-dialog
		v-model="dialog"
		persistent
		max-width="640"
		min-width="480"
	>
		<template v-slot:activator="{ on, attrs }">
			<v-btn
				v-bind="attrs"
				v-on="on"
				icon
				plain
			>
				<v-icon>mdi-border-color</v-icon>
			</v-btn>
		</template>
		<v-card>
			<v-card-title class="text-h5 text-center" v-text="additionalEOSTitle"></v-card-title>
			<v-card-text>
				<v-text-field v-model="localAdditionalEOSDataValue" :type="isNumber ? 'number' : 'text'"></v-text-field>
			</v-card-text>
			<v-card-actions>
				<v-btn
					color="red lighten-1"
					text
					@click="dialog = false, localAdditionalEOSDataValue = ''"
				>
					Отменить
				</v-btn>
				<v-spacer></v-spacer>
				<v-btn
					color="teal accent-3"
					text
					@click="dialog = false, $emit('onSaveAdditionalData', localAdditionalEOSDataValue)"
				>
					Сохранить
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>

export default {
	props: ['additionalEOSTitle', 'additionalEOSDataValue', 'isNumber'],
	data: () => ({
		dialog: false,
		localAdditionalEOSDataValue: '',
	}),
	created () {
		this.localAdditionalEOSDataValue = this.additionalEOSDataValue
	},
	watch: {
		localAdditionalEOSDataValue(newVal) { 
			this.localAdditionalEOSDataValue = newVal
		}
	},
}
</script>
<style>
	
</style>