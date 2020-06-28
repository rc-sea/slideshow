<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      fixed
      :mini-variant.sync="miniVariant"
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
    <v-navigation-drawer
      v-if="hasSearchDrawer"
      app
      clipped
      fixed
      :mobile-breakpoint="0"
      right
      :width="tagNavWidth"
    >
      <search-drawer />
    </v-navigation-drawer>
    <v-main>
      <nuxt />
    </v-main>
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
          <v-tooltip v-for="iconData in shareIcons" :key="iconData.icon" top>
            <template #activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                class="mx-4 white--text"
                :href="iconData.url"
                icon
                rel="noopener"
                target="_blank"
                v-on="on"
              >
                <v-icon>{{ iconData.icon }}</v-icon>
              </v-btn>
            </template>
            Share on {{ iconData.title }}
          </v-tooltip>
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
import { createShareIcons } from '~/util/share.js';
import { getLocalStorageValue } from '~/util/localStorage';

export default {
  components: {
    SearchDrawer,
  },

  data () {
    return {
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
      shareIcons: createShareIcons(process.env.BASE_URL.replace(/\/$/, '') + this.$nuxt.$route.fullPath),
      miniVariant: false,
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
    drawer: {
      get () {
        return this.$store.state.main_nav;
      },
      set (value) {
        this.$store.commit('set_main_nav', value);
      },
    },
  },
  async mounted () {
    if (this.$auth && this.$auth.user && !this.user) {
      await this.$store.commit('user/SET_USER', getLocalStorageValue('rememberinglouise_user'));
    }
    await this.$store.dispatch('tags/gettags');
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
