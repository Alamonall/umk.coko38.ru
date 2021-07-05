<template>
  <v-combobox
    v-model='active'
    chips
    clearable
    label='Выберите предметы'
    multiple
    prepend-icon="mdi-filter-variant"
    solo
  >
  </v-combobox>
</template>
<script>
export default {
	props:['subjects'],
	data: () => ({
		active: ['position']
	}),
	/* watch: {
		active: function(){
			this.$emit('getSubjects', active)
		}
	}, */
	methods: {
		remove (item) {
			this.active.splice(this.active.indexOf(item), 1)
			this.active = [...this.active]
		},
	},
}
</script>
<style lang="">
	
</style>