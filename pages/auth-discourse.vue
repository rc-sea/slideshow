<template>
  <v-container fluid>
    <default-app-bar />
    <v-row align="center" class="loading-row" justify="center">
      <v-progress-circular color="gray" indeterminate :size="200" :width="20" />
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import { getLocalStorageValue } from '~/util/localStorage';
import DefaultAppBar from '~/components/DefaultAppBar';

export default {
  components: {
    DefaultAppBar,
  },

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
