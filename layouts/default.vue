<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      clipped
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
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
      :hide-on-scroll="true"
      fixed
      app
      color="indigo"
      clipped-left
      clipped-right
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <div class="hidden-sm-and-down">
        <v-toolbar-title v-text="title" class="new-headline"/>
      </div>
      <div class="hidden-md-and-up">
        <v-toolbar-title v-text="title" class="md-headline"/>
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
        <v-menu offset-y v-if="user && $auth.user">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" text fab>
              <v-avatar :size="35">
                <v-img :src="$auth.user.picture" alt="$auth.user.name"></v-img>
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
        <v-btn v-else @click="login" text>Log in</v-btn>
      </v-card-actions>
    </v-app-bar>
    <v-content>
      <div class="content-navigation-wrapper">
        <nuxt />
        <search-drawer />
      </div>
    </v-content>
  <v-footer
    color="indigo darken-2">
    <v-card color="indigo darken-2"
      class="flex"
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

  computed: {
    ...mapState({
      user: state => state.user.user,
      editor_role: state => state.user.editor_role,
      resources_wrap: state => state.resources,
      search_tag: state => state.search_tag,
      search_type: state => state.search_type,
      detailsPage_url: state => state.detailsPage_url,
    }),
  },
  head () {
    return {
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap' }
      ]
    }
  },
  methods: {
    onLogout() {
      this.$auth.logout();
      this.$store.commit("user/SET_USER", null);
    },
    login() {
      window.localStorage.setItem('redirect_url', this.$route.fullPath);
      window.localStorage.setItem('resources', JSON.stringify(this.resources_wrap));
      window.localStorage.setItem('state', JSON.stringify({
        search_tag: this.search_tag,
        search_type: this.search_type,
        detailsPage_url: this.detailsPage_url
      }));
      this.$auth.loginWith('auth0');
    },
  },
  async mounted() {
    if (this.$auth && this.$auth.user && !this.user) {
      await this.$store.commit("user/SET_USER", JSON.parse(window.localStorage.getItem('rememberinglouise_user')));
    }
    await this.$store.dispatch('tags/gettags')
  },
  data () {
    return {
      drawer: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Home',
          to: '/'
        },
        {
          icon: 'mdi-camera',
          title: 'View Photos',
          to: '/photo-browse'
        },
        {
          icon: 'mdi-comment-text',
          title: 'Remembrances',
          to: '/remembrances'
        },
        {
          icon: 'mdi-camera',
          title: 'Funeral Service',
          to: '/service'
        }
      ],
      miniVariant: false,
      title: 'Remembering Louise',
    }
  }
}
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
.content-navigation-wrapper {
  display: flex;
  height: 100%;
  .navigation-wrapper {
    padding: 0 13px;
  }
}
a {
  text-decoration: none;
}
</style>
