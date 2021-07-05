<template>
  <v-container
    class="px-0"
    fluid
  >
		<v-card	>
			<v-card-title  class='text-h4'> 
				УМК: {{ emcOnSchool.EMC.title }} 
			</v-card-title>
			<v-card-text class='text-h5'>
				<div>
					<v-chip
						v-show='emcOnSchool.isApproved'
						color="green"
						text-color="white"
						pill
						> 
						Подтверждено
					</v-chip>
					<v-chip
						v-show='!emcOnSchool.isApproved'
						color="yellow"
						text-color="black"
						pill
						> 
						Не подтверждено
					</v-chip>
					<v-chip
						v-show='emcOnSchool.EMC.isCustom'
						color="red"
						text-color="white"
						pill
						>
						Пользовательский
					</v-chip>
				</div>
				<p> <strong> Издательство: </strong>  {{ emcOnSchool.EMC.Publisher.publisherName }} </p>
				<p> <strong>  Авторы: </strong>  {{ emcOnSchool.EMC.authors }} </p>
				<p> Класс: {{ emcOnSchool.EMC.grades }} </p>
				<p> Кол-во учеников: {{ emcOnSchool.studentsCount }} </p>
			</v-card-text>
			<v-card-actions>	
				<v-btn 
					text
					color="teal accent-4"
					@click="isDetailing = !isDetailing"
					>
					Комментарии
				</v-btn>
				<v-btn 
					text
					color="teal accent-4"
					@click="$emit('onSwapApprovingStatusEMCOnSchool', emcOnSchool)"
					>
						<div v-if='!emcOnSchool.isApproved'>Подтвердить</div>
						<div v-else>Снять потдверждение</div>
				</v-btn>
				<v-btn 
					text
					color="teal accent-4"
					:to="{ name: 'admin-emc-edit', params: { emcId: emcOnSchool.emcId }}"
					>
					Редактировать
				</v-btn>
				<v-btn 
					text
					color="teal accent-4"
					@click="$emit('onDetachEMCFrom', emcOnSchool)"
					>
						Открепить УМК
				</v-btn>
				<v-btn 
					v-if='emcOnSchool.EMC.createBy'
					text
					color="teal accent-4"
					@click="$emit('onSwapCreatingStatusEMC', emcOnSchool)"
					>
					<div v-if='emcOnSchool.EMC.isCustom'>Сделать официальным (ещё не работает)</div>
					<div v-else>Сделать снова пользовательским </div>						
				</v-btn>
			</v-card-actions>
		</v-card>
		<v-expand-transition>
			<v-card
				v-show='isDetailing'
				>
				<v-card-text class="pb-0">
					<p><strong>Причина исползования:</strong> {{ emcOnSchool.usingCoz }}</p>
					<p><strong>Причина изменений:</strong>  {{ emcOnSchool.correctionCoz }} </p>
					<p><strong>Причина смены: </strong> {{ emcOnSchool.swapCoz }} </p>
				</v-card-text>
			</v-card>
		</v-expand-transition>
	</v-container>
</template>
<script>

export default {
	props: ['emcOnSchool'],
  data: () => ({
		isDetailing: false
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
