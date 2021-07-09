<template>
	<v-navigation-drawer app width="20%" left="true" permanent absolute clipped>
		<v-list-item>
			<v-list-item-content>
				<v-list-item-icon>
					<v-icon>mdi-home</v-icon>
				</v-list-item-icon>
				<v-list-item-title> МО</v-list-item-title>
				<v-list-item-subtitle>subtext </v-list-item-subtitle>
			</v-list-item-content>
		</v-list-item>
		<v-divider></v-divider>
		<slot> Нет данных </slot>
	</v-navigation-drawer>
</template>

<script>
export default {}
</script>

<style scoped></style>
