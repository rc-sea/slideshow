<template>
  <v-container fluid >
    <v-row justify="center" class="loading-row" align="center">
      <v-progress-circular :size="200" :width="20" color="gray" indeterminate></v-progress-circular>
    </v-row>
  </v-container>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState({
      user: state => state.user.user
    })
  },
  async mounted() {
    console.log(this.$auth.user);
    await this.$store.dispatch('user/set_user', { user: this.$auth.user });
    console.log(this.user);
    if(process.browser){
      this.$router.replace({
        path: window.localStorage.getItem('redirect_url')
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.loading-row {
  height: 700px;
}
</style>