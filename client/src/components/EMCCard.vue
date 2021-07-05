<template>
  <v-container
    class="px-0"
    fluid
  >
		<v-card	>
			<v-card-title  class='text-h4'> {{ emc.title }} </v-card-title>
			<v-card-text class='text-h5'>
				<div>
					<v-chip
						v-show='emc.isCustom'
						color="red"
						text-color="white"
						pill
						>
						Пользовательский
					</v-chip>
				</div>
				<p> <strong> Издательство: </strong>  {{ emc.Publisher.name }} </p>
				<p> <strong> Авторы: </strong>  {{ emc.authors }} </p>
				<p> <strong> Класс: </strong> {{ emc.grades }} </p>
			</v-card-text>
			<v-card-actions>
				<v-btn 
					text
					color="teal accent-4"
					:to="{ name: 'admin-emc-edit', params: { emcId: emc.id } }"
					>
					Редактировать
				</v-btn>
				<v-btn 
					v-if='emc.createBy'
					text
					color="teal accent-4"
					@click="$emit('onSwapCreatingStatusEMC', emc)"
					>
					<div v-if='emc.isCustom'>Сделать официальным</div>
					<div v-else>Сделать снова пользовательским </div>						
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-container>
</template>
<script>

export default {
	props: ['emc'],
  data: () => ({
	})
}
</script>

<style scoped>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>
