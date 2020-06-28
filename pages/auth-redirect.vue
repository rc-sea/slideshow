<template>
  <v-container fluid>
    <default-app-bar />
    <v-row align="center" class="loading-row" justify="center">
      <v-progress-circular color="gray" indeterminate :size="200" :width="20" />
    </v-row>
  </v-container>
</template>

<script>
import DefaultAppBar from '~/components/DefaultAppBar';

export default {
  components: {
    DefaultAppBar,
  },
};
</script>

<style lang="scss" scoped>
.loading-row {
  height: 700px;
}
</style>
