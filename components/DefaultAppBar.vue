<template>
  <v-app-bar
    app
    clipped-left
    clipped-right
    color="indigo"
    extension-height="64"
    fixed
    hide-on-scroll
  >
    <v-app-bar-nav-icon @click="toggleMainDrawer" />

    <v-toolbar-title class="hidden-sm-and-down new-headline">Remembering Louise</v-toolbar-title>
    <v-toolbar-title class="hidden-md-and-up md-headline">Remembering Louise</v-toolbar-title>

    <v-spacer />

    <v-btn
      class="v-btn__disabled-active-state"
      color="purple lighten-4"
      nuxt
      rounded
      style="color: #303f9f"
      to="/photo-browse"
    >
      <v-icon large>mdi-image-search</v-icon>
      <span class="hidden-sm-and-down">View Photos</span>
    </v-btn>

    <v-spacer />

    <div class="hidden-md-and-down">
      <v-btn nuxt rounded text to="/service">Funeral Service</v-btn>
      <v-btn nuxt rounded text to="/remembrances">Remembrances</v-btn>
    </div>

    <template v-if="user && $auth.user">
      <v-btn id="user-button" fab text>
        <v-avatar :size="35">
          <img :alt="$auth.user.name" :src="$auth.user.picture">
        </v-avatar>
      </v-btn>
      <v-menu activator="#user-button" offset-y>
        <v-list>
          <v-list-item @click="logout">
            <v-icon class="pr-3" large>mdi-account-circle-outline</v-icon>
            <v-list-item-title>Log Out</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    <v-btn
      v-else
      color="green lighten-4"
      rounded
      text
      @click="login"
    >
      <v-icon class="mx-1" large>mdi-account-circle-outline</v-icon>
      <span class="hidden-sm-and-down">Log in</span>
    </v-btn>

    <template v-if="$slots.extension" #extension>
      <slot name="extension" />
    </template>
  </v-app-bar>
</template>

<script>
import { mapState } from 'vuex';
import { setLocalStorageValue } from '~/util/localStorage';

export default {
  name: 'DefaultAppBar',

  computed: {
    ...mapState({
      user: state => state.user.user,
    }),
  },

  methods: {
    logout () {
      this.$auth.logout();
      this.$store.commit('user/SET_USER', null);
    },
    login () {
      setLocalStorageValue('redirect_url', this.$route.fullPath);
      setLocalStorageValue('resources', this.resources_wrap);
      setLocalStorageValue('state', {
        search_tag: this.search_tag,
        search_type: this.search_type,
        detailsPage_url: this.detailsPage_url,
      });
      this.$auth.loginWith('auth0');
    },
    toggleMainDrawer () {
      this.$store.commit('set_main_nav', !this.$store.state.main_nav);
    },
  },
};
</script>

<style lang="scss" scoped>
.new-headline {
  font-family: 'Pinyon Script', cursive;
  font-size:48px;
}
.md-headline  {
  font-family: 'Pinyon Script', cursive;
  font-size:30px;
}
/* https://github.com/vuetifyjs/vuetify/issues/11149 */
.v-btn__disabled-active-state::before {
  opacity: 0 !important;
}
</style>

<style>
/* https://github.com/vuetifyjs/vuetify/issues/7856 */
.v-app-bar .v-toolbar__extension {
  background: #263238; /* blue-grey darken-4 */
}
</style>
