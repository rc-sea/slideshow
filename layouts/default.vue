<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
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
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" class="new-headline"/>
      <v-spacer />
      <v-btn color="purple lighten-4">
        <nuxt-link to="/photo-browse">View Photos</nuxt-link> 
      </v-btn>
      <v-spacer />
      <v-card-actions>
        <nuxt-link to="/service">
        <v-btn text>Funeral Service</v-btn></nuxt-link>
        <v-menu offset-y v-if="user && $auth.user">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" text fab>
              <v-avatar :size="35">
                <v-img :src="$auth.user.picture" alt="$auth.user.name"></v-img>
              </v-avatar>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="onLogout">
              <v-list-item-title>Log Out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn v-else @click="login" text>Log in</v-btn>
      </v-card-actions>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  <v-footer >
    <v-card
      class="flex"
      flat
      tile
    >
      <v-card-text class="py-2 white--text text-center">
        {{ new Date().getFullYear() }} — <strong>Remembering Louise</strong>
      </v-card-text>
    </v-card>
  </v-footer>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState({
      user: state => state.user.user
    })
  },
  head () {
    return {
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap' }
      ]
    }
  },
  data () {
    return {
      clipped: true,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        },
        {
          icon: 'mdi-camera',
          title: 'View SlideShow',
          to: '/photo-browse'
        },
        {
          icon: 'mdi-camera',
          title: 'Photo Detail',
          to: '/photo'
        }
      ],
      miniVariant: false,
      title: 'Remembering Louise'
    }
  },
  methods: {
    onLogout() {
      this.$auth.logout();
      this.$store.commit("user/SET_USER", null);
    },
    login() {
      window.localStorage.setItem('redirect_url', window.location.pathname);
      this.$auth.loginWith('auth0');
    }
  }
}


</script>

<style scoped>
.new-headline {
  font-family: 'Pinyon Script', cursive;
  font-size:48px;
}
a {
  text-decoration: none;
}
</style>
