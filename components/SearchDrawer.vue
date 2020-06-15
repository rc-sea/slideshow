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
        <v-col cols="12">
          <v-text-field v-model="tagFilter" clearable solo-inverted label="Filter tags" autocomplete="off" />
          <template v-for="(tag_group, tag_type) in selectedTags">
            <div v-if="filteredTags[tag_type].length" :key="tag_type" class="mb-4">
              <v-subheader class="overline">{{ tag_type }}</v-subheader>
              <v-chip-group  v-model="selectedTags[tag_type]" active-class="success--text text--lighten-2" multiple class="mx-4" column @change="onSelectTags(tag_type)">
                <v-chip v-for="tag in filteredTags[tag_type]" filter :key="tag">{{ capitalizeTag(tag) }} </v-chip>
              </v-chip-group>
            </div>
          </template>
        </v-col>
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
      tagFilter: '',
      initial_tags: {
        "Favorites": ["louise", "bob", "best"],
        "Couples": ["frank_mary", "eleanor_bill", "bob_louise"],
        "Other Folk": ["robert_c", "john", "brian", "ellen", "paul", "robert_d", "jane", "susan", "janet"]
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
    filteredTags: function() {
      const filteredTags = {};

      for (let group in this.initial_tags) {
        filteredTags[group] = this.filterTags(this.initial_tags[group]);
      }
      filteredTags["All"] = this.filterTags(this.tags);

      return filteredTags;
    },
  },

  watch: {
    '$route.query': {
      immediate: true,
      handler (query) {
        const { search, type } = query || {};
        const searchTags = (search || '').split('-')

        if (search) {
          this.searchType = type | 0
          for (let group in this.selectedTags) {
            searchTags.forEach(tag => {
              const index = group === "All"
                  ? this.tags.indexOf(tag)
                  : this.initial_tags[group].indexOf(tag);

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
      }
    },
  },

  methods: {
    capitalizeTag (tag) {
      const capitalized = tag.replace(/_/g, ' ').replace(/(?: |\b)(\w)/g, key => key.toUpperCase());

      if (!this.initial_tags.Couples.includes(tag)) return capitalized;

      const [first, second] = capitalized.split(' ')
      return `${first} and ${second}`;
    },
    filterTags (tags) {
      const filterLowercased = (this.tagFilter || '').toLowerCase();

      return tags.filter(tag => tag.toLowerCase().includes(filterLowercased));
    },
    async onSelectTags(tag_group) {
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
      const groupTags = tag_group === "All" ? this.tags : this.initial_tags[tag_group];
      const selectedIndices = this.selectedTags[tag_group];
      const searchTagsArray = selectedIndices.map(index => groupTags[index])

      for (let group in this.selectedTags) {
        if (group !== tag_group) {
          this.selectedTags[group] = [];
        }
      }

      return searchTagsArray.join('-');
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
