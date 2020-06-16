<template>
  <v-container>
    <v-container fluid>
      <v-row align="center" class="loading-row" justify="center">
        <v-progress-circular color="gray" indeterminate :size="200" :width="20" />
      </v-row>
    </v-container>
  </v-container>
</template>

<style lang="scss" scoped>
.loading-row {
  height: 700px;
}
</style>
