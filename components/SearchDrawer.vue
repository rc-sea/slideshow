<template>
  <v-navigation-drawer
    v-if="hasSearchDrawer"
    right
    app
    clipped
    fixed
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
</template>

<script>
import { mapState } from 'vuex';
export default {
  data () {
    return {
      searchType: 0,
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
      }
    };
  },

  computed: {
    ...mapState({
      tag_nav: state => state.tag_nav,
      tags: state => state.tags.tags,
      total_count: state => state.resources.total_count,
    }),
    hasSearchDrawer: function() {
      return this.$route.name === "photo-browse" && this.tag_nav;
    },
    typeText: function() {
      return this.searchType === 0 ? 'Any Tag Matches' : 'All Tags Match'
    },
  },

  beforeUpdate() {
    var { search, type } = this.$route.query
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
    } else {
      for (let group in this.selectedTags) {
        this.selectedTags[group] = [];
      }
    }
  },

  methods: {
    async onSelectTags(tag_group) {
      console.log(this.selectedTags[tag_group])
      this.$store.commit('set_browse_loading', true);

      if (this.selectedTags[tag_group].length) {

        let searchtag = this.generateSearchTag(tag_group);
        this.$store.commit('set_details_state', {
          detailsPage_url: `/photo-browse?search=${searchtag}&type=${this.searchType}`,
          search_tag: searchtag,
          search_type: this.searchType
        });
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
  },
}
</script>

<style lang="scss" scoped>
.total-number {
  border-radius: 10px;
  font-size: 15px;
  line-height: 28px;
  padding: 0 14px;
}
</style>
