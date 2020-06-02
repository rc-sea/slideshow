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
        <v-container>
          <nuxt />
        </v-container>
        <v-navigation-drawer
          v-if="isAllowedTagNav"
          right
          width="300"
        >
          <v-container v-if="!tags" justify="center" class="loading-row" align="center">
            <v-progress-circular :size="100" :width="10" color="gray" indeterminate></v-progress-circular>
          </v-container>
          <v-container v-else class="navigation-wrapper">
            <v-row class="mt-1 mb-1">
              <v-btn small @click="onHideNav">&#8811;</v-btn>
              <v-btn small @click="changeType" class="ml-1 mr-1">{{typeText}}</v-btn>
              <span class="brown total-number">{{ total_count }}</span>
            </v-row>
            <v-row>
              <v-expansion-panels accordion>
                <v-expansion-panel v-for="(tag_group, tag_type) in initial_tags" :key="tag_type">
                  <v-expansion-panel-header>{{tag_type}}</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-list>
                      <v-list-item-group v-model="selectedTags[tag_type]" active-class="primary" @change="onSelectTags(tag_type)" multiple>
                        <v-list-item v-for="custom_tag in tag_group" :key="custom_tag.label">{{ custom_tag.label }}</v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-expansion-panel-content>
                </v-expansion-panel>

                <v-expansion-panel key="all">
                  <v-expansion-panel-header>All Tags</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-list>
                      <v-list-item-group v-model="selectedTags['All']" active-class="primary" @change="onSelectTags('All')" multiple>
                        <v-list-item v-for="tag in tags" :key="tag">{{ tag }}</v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-row>
          </v-container>
        </v-navigation-drawer>
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
export default {
  computed: {
    ...mapState({
      user: state => state.user.user,
      tag_nav: state => state.tag_nav,
      tags: state => state.tags.tags,
      total_count: state => state.resources.total_count,
    }),
    isAllowedTagNav: function() {
      if (this.$route.name !== "photo-browse")
        return false;
      return this.tag_nav;
    },
    typeText: function() {
      return this.searchType === 0 ? 'Any Tag Matches' : 'All Tags Match'
    },
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
      searchType: 0,
      clipped: true,
      drawer: false,
      fixed: false,
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
      right: true,
      rightDrawer: false,
      title: 'Remembering Louise',
      initial_tags: {
        "Favorites": [
          {
            label:"Louise",
            value: "louise"
          },
          { 
            label:"Bob",
            value: "bob"
          },
          { 
            label:"Best",
            value: "best"
          }
        ],
        "Couples": [
          {
            label:"Frank and Mary",
            value: "frank_mary"
          },
          {
            label:"Eleanor and Bill",
            value:"eleanor_bill"
          },
          {
            label:"Bob and Louise",
            value: "bob_louise"
          }
        ],
        "Other Folk": [
          {
            label:"Robert C",
            value: "robert_c"
          },
          {
            label:"John",
            value:"john"
          },
          {
            label:"Brian",
            value:"brian"
          },
          {
            label:"Ellen",
            value:"ellen"
          },
          {
            label:"Paul",
            value:"paul"
          },
          {
            label:"Robert D",
            value:"robert_d"
          },
          {
            label:"Jane",
            value:"jane"
          },
          {
            label:"Susan",
            value:"susan"
          },
          {
            label:"Janet",
            value:"janet"
          }
        ]
      },
      selectedTags: {
        "Favorites": [],
        "Couples": [],
        "Other Folk": [],
        "All": []
      },
    }
  },
  methods: {
    onLogout() {
      this.$auth.logout();
      this.$store.commit("user/SET_USER", null);
    },
    login() {
      window.localStorage.setItem('redirect_url', this.$route.fullPath);
      this.$auth.loginWith('auth0');
    },
    generateSearchTag(tag_group) {
      let searchtag;

      if (tag_group === "All") {
        searchtag = this.tags[this.selectedTags['All'][0]]
        for (var i = 1; i < this.selectedTags['All'].length; i++) {
          searchtag += '-' + this.tags[this.selectedTags['All'][i]]
        }
      } else {
        searchtag = this.initial_tags[tag_group][this.selectedTags[tag_group][0]].value
        for (var i = 1; i < this.selectedTags[tag_group].length; i++) {
          searchtag += '-' + this.initial_tags[tag_group][this.selectedTags[tag_group][i]].value
        }
      }
      for (let group in this.selectedTags) {
        if (group !== tag_group) {
          this.selectedTags[group] = [];
          
        }
      }
      return searchtag;
    },
    onHideNav() {
      this.$store.commit('set_tag_nav', false);
      console.log(this.tag_nav);
    },
    async changeType() {
      var { search, type } = this.$route.query;
      this.searchType = 1 - type;
      this.$router.go({
        path: `/photo-browse?search=${search}&type=${this.searchType}`
      })
      if (search) {
        await this.$store.dispatch('resources/search', {
          searchtag: search,
          type: this.searchType
        });
      } else {
        await this.$store.dispatch('resources/getresources');
      }
    },
    async onSelectTags(tag_group) {
      console.log(this.selectedTags[tag_group])
      this.$store.commit('set_browse_loading', true);

      if (this.selectedTags[tag_group].length) {
        
        let searchtag = this.generateSearchTag(tag_group);
        this.$router.push({
          path: `/photo-browse?search=${searchtag}&type=${this.searchType}`
        })

        await this.$store.dispatch('resources/search', {
          searchtag: searchtag,
          type: this.searchType
        })
      } else {
        await this.$store.dispatch('resources/getresources')
      }

      this.$store.commit('set_browse_loading', false);
    }
  },
  async created() {
      var { search, type } = this.$route.query
      await this.$store.dispatch('tags/gettags')
      if (search) {
        this.searchType = type | 0
        for (let group in this.selectedTags) {
          search.split('-').forEach(tag => {
            let index = -1;
            if (group === "All")
              index = this.tags.indexOf(tag);
            else {
              for (let i = 0; i < this.initial_tags[group].length; i ++) {
                if (this.initial_tags[group][i].value === tag) {
                  index = i;
                }
              }
            }
            if (index !== -1 && this.selectedTags[group].indexOf(index) === -1) {
              this.selectedTags[group].push(index)
            }
          })
        }
      }
    },
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
.total-number {
  border-radius: 10px;
  font-size: 15px;
  line-height: 28px;
  padding: 0 14px;
}
</style>
