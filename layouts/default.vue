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
      <v-btn large color="purple lighten-4">
        <nuxt-link to="/photo-browse">Launch app</nuxt-link> 
      </v-btn>
      <v-spacer />
      <v-card-actions>
      <nuxt-link to="/service">
      <v-btn text>Funeral Service</v-btn></nuxt-link>
      <nuxt-link to="/about"><v-btn text>About</v-btn></nuxt-link>
      </v-card-actions>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  <v-footer
    dark
  >
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
export default {
    head () {
    return {
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap' }
      ]
    }
  },
  data () {
    return {
      clipped: false,
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
          title: 'Photo Browse',
          to: '/photo-browse'
        },
        {
          icon: 'mdi-camera',
          title: 'Photo Detail',
          to: '/photo'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Remembering Louise'
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
