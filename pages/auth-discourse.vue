<template>
  <v-container>
    <v-container fluid>
      <v-row align="center" class="loading-row" justify="center">
        <v-progress-circular color="gray" indeterminate :size="200" :width="20" />
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import { getLocalStorageValue } from '~/util/localStorage';

export default {
  computed: {
    ...mapState({
      user: state => state.user.user,
    }),
  },
  async mounted () {
    console.log(this.$auth.user);
    await this.$store.dispatch('user/set_user', { user: this.$auth.user });
    this.$store.commit('set_just_login', true);
    console.log(this.user);
    if (process.browser) {
      this.$router.replace({
        path: getLocalStorageValue('redirect_url'),
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.loading-row {
  height: 700px;
}
</style>
