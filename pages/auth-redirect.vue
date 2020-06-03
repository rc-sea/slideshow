<template>
  <v-container>
    <v-container fluid >
      <v-row justify="center" class="loading-row" align="center">
        <v-progress-circular :size="200" :width="20" color="gray" indeterminate></v-progress-circular>
      </v-row>
    </v-container>
  </v-container>
</template>

<style lang="scss" scoped>
.loading-row {
  height: 700px;
}
</style>