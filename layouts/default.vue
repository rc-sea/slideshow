<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      fixed
      :mini-variant="miniVariant"
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          exact
          router
          :to="item.to"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        <!-- <v-list-item v-if="$auth.loggedIn">
          <v-btn @click="$auth.logout()">Log out</v-btn>
        </v-list-item> -->
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      clipped-left
      clipped-right
      color="indigo"
      fixed
      :hide-on-scroll="true"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <div class="hidden-sm-and-down">
        <v-toolbar-title class="new-headline" v-text="title" />
      </div>
      <div class="hidden-md-and-up">
        <v-toolbar-title class="md-headline" v-text="title" />
      </div>
      <v-spacer />
      <div class="hidden-sm-and-down">
        <v-btn color="purple lighten-4">
          <nuxt-link to="/photo-browse">View Photos</nuxt-link>
        </v-btn>
      </div>
      <v-spacer />
      <v-card-actions>
        <div class="hidden-md-and-down">
          <nuxt-link to="/service">
            <v-btn text>Funeral Service</v-btn></nuxt-link>
          <nuxt-link to="/remembrances">
            <v-btn text>Remembrances</v-btn></nuxt-link>
        </div>
        <v-menu v-if="user && $auth.user" offset-y>
          <template v-slot:activator="{ on }">
            <v-btn fab text v-on="on">
              <v-avatar :size="35">
                <v-img alt="$auth.user.name" :src="$auth.user.picture" />
              </v-avatar>
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-if="user && editor_role" to="photo-upload">
              <v-list-item-title>Photo Upload</v-list-item-title>
            </v-list-item>
            <v-list-item @click="onLogout">
              <v-list-item-title>Log Out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn v-else text @click="login">Log in</v-btn>
      </v-card-actions>
    </v-app-bar>
    <v-content>
      <nuxt />
      <v-navigation-drawer
        v-if="hasSearchDrawer"
        app
        clipped
        fixed
        :mobile-break-point="0"
        right
        :width="tagNavWidth"
      >
        <search-drawer />
      </v-navigation-drawer>
    </v-content>
    <v-footer
      app
      color="indigo darken-2"
    >
      <v-card class="flex"
              color="indigo darken-2"
      >
        <v-card-title class="py-2 white--text text-center">
          {{ new Date().getFullYear() }} — Eclectic Company
        </v-card-title>
        <v-card-text><nuxt-link to="/privacy">
                       <v-btn text>Privacy Policy</v-btn></nuxt-link>
          <nuxt-link to="/terms">
            <v-btn text>Terms of use</v-btn></nuxt-link>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';
import SearchDrawer from '@/components/SearchDrawer';

export default {
  components: {
    SearchDrawer,
  },

  data () {
    return {
      drawer: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Home',
          to: '/',
        },
        {
          icon: 'mdi-camera',
          title: 'View Photos',
          to: '/photo-browse',
        },
        {
          icon: 'mdi-comment-text',
          title: 'Remembrances',
          to: '/remembrances',
        },
        {
          icon: 'mdi-camera',
          title: 'Funeral Service',
          to: '/service',
        },
      ],
      miniVariant: false,
      title: 'Remembering Louise',
    };
  },

  computed: {
    ...mapState({
      user: state => state.user.user,
      editor_role: state => state.user.editor_role,
      resources_wrap: state => state.resources,
      search_tag: state => state.search_tag,
      search_type: state => state.search_type,
      tag_nav: state => state.tag_nav,
      detailsPage_url: state => state.detailsPage_url,
    }),
    hasSearchDrawer: function () {
      return this.$route.name === 'photo-browse' && this.tag_nav;
    },
    tagNavWidth: function () {
      return this.$vuetify.breakpoint.smAndDown ? 300 : 360;
    },
  },
  async mounted () {
    if (this.$auth && this.$auth.user && !this.user) {
      await this.$store.commit('user/SET_USER', JSON.parse(window.localStorage.getItem('rememberinglouise_user')));
    }
    await this.$store.dispatch('tags/gettags');
  },
  methods: {
    onLogout () {
      this.$auth.logout();
      this.$store.commit('user/SET_USER', null);
    },
    login () {
      window.localStorage.setItem('redirect_url', this.$route.fullPath);
      window.localStorage.setItem('resources', JSON.stringify(this.resources_wrap));
      window.localStorage.setItem('state', JSON.stringify({
        search_tag: this.search_tag,
        search_type: this.search_type,
        detailsPage_url: this.detailsPage_url,
      }));
      this.$auth.loginWith('auth0');
    },
  },
  head () {
    return {
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap' },
      ],
    };
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
a {
  text-decoration: none;
}
</style>
