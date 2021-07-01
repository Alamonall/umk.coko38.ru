<template>
  <v-card
    class="mx-auto"
    width="30%"
  >
    <v-list>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-home</v-icon>
        </v-list-item-icon>

        <v-list-item-title>МО</v-list-item-title>
      </v-list-item>
			<slot></slot>
      
    </v-list>
  </v-card>
</template>

<script>
export default {
}
</script>

<style scoped></style>
