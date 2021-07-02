<template>
  <div>
		<v-card	>
			<v-card-title class="text-h4"> 
				<slot name='emc-title'></slot>
			</v-card-title>
			<v-card-text class="text-h5">
				<slot name='emc-main-info'></slot>
			</v-card-text>
			<v-card-actions>	
				<v-btn 
					v-show='!show'
					text
					@click="show = true"
					>
					Детали
				</v-btn>
				<v-btn
					v-show='show'
					text
					color="teal accent-4"
					@click="show = false"
					>
					Закрыть
				</v-btn>
				<slot name='user-actions'></slot>
			</v-card-actions>

			<v-expand-transition>
				<v-card
					v-show="show"
				>
					<v-card-text class="pb-0">
						<slot name='emc-additional-info'></slot>
					</v-card-text>
				</v-card>
			</v-expand-transition>
		</v-card>
	</div>
</template>

<script>

export default {
  data: () => ({
		show: false
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
