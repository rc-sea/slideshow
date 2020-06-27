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
      <div>
        <v-btn
          color="purple lighten-4"
          rounded
        >
          <nuxt-link to="/photo-browse">
            <v-icon large>mdi-image-search</v-icon>
            <span class="hidden-sm-and-down">View Photos</span>
          </nuxt-link>
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
            <v-list-item @click="onLogout">
              <v-icon class="pr-3" large>mdi-account-circle-outline</v-icon>
              <v-list-item-title>Log Out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn v-else color="green lighten-4"
               rounded text @click="login"
        >
          <v-icon large>mdi-account-circle-outline</v-icon>
          <span class="hidden-sm-and-down">Log in</span>
        </v-btn>
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
      dark
      padless
    >
      <v-card
        class="indigo lighten-1 white--text text-center"
        flat
        tile
      >
        <v-card-text>
          <v-btn
            v-for="footericon in footericons"
            :key="footericon"
            class="mx-4 white--text"
            icon
          >
            <v-icon size="24px">{{ footericon }}</v-icon>
          </v-btn>
        </v-card-text>

        <v-card-text class="white--text pt-0">
          Phasellus feugiat arcu sapien, et iaculis ipsum elementum sit amet. Mauris cursus commodo interdum. Praesent ut risus eget metus luctus accumsan id ultrices nunc. Sed at orci sed massa consectetur dignissim a sit amet dui. Duis commodo vitae velit et faucibus. Morbi vehicula lacinia malesuada. Nulla placerat augue vel ipsum ultrices, cursus iaculis dui sollicitudin. Vestibulum eu ipsum vel diam elementum tempor vel ut orci. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
        </v-card-text>

        <v-divider />

        <v-card-text class="white--text">
          {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
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
      footericons: [
        'mdi-facebook',
        'mdi-twitter',
        'mdi-instagram',
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
