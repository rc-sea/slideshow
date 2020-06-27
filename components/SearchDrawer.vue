<template>
  <div>
    <div class="ma-2">
      <v-row align="center" dense>
        <v-col>
          <v-text-field v-model="tagFilter" autocomplete="off" autofocus hide-details label="Filter tags" solo-inverted />
        </v-col>
        <v-col cols="auto">
          <v-btn icon outlined @click="onHideNav"><v-icon small>mdi-chevron-double-right</v-icon></v-btn>
        </v-col>
      </v-row>
    </div>

    <v-divider class="my-2" />

    <v-row align="center" class="mx-2" dense>
      <v-col class="overline" cols="auto">Match:</v-col>
      <v-col>
        <v-btn-toggle class="mx-0 px-0" color="success" :value="searchType" @change="changeSearchType">
          <v-btn small :value="0">any tag</v-btn>
          <v-btn small :value="1">all tags</v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <template v-for="(tag_group, tag_type) in selectedTags">
      <div v-if="filteredTags[tag_type].length" :key="tag_type" class="mb-4">
        <v-subheader class="caption">
          {{ tag_type }}
          <span v-if="selectedTags[tag_type].length" style="text-transform: none">&nbsp;({{ selectedTags[tag_type].length }}/{{ allTags[tag_type].length }} selected)</span>
        </v-subheader>
        <v-chip-group v-model="selectedTags[tag_type]" active-class="success--text text--lighten-2" class="mx-4" column multiple>
          <v-chip v-for="tag in filteredTags[tag_type]" :key="tag" filter>{{ capitalizeTag(tag) }} </v-chip>
        </v-chip-group>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data () {
    return {
      tagFilter: '',
      initial_tags: {
        Favorites: ['louise', 'bob', 'best'],
        Couples: ['frank_mary', 'eleanor_bill', 'bob_louise'],
        'Other Folk': ['robert_c', 'john', 'brian', 'ellen', 'paul', 'robert_d', 'jane', 'susan', 'janet'],
      },
      selectedTags: {
        Favorites: [],
        Couples: [],
        'Other Folk': [],
        All: [],
      },
    };
  },

  computed: {
    ...mapState({
      tag_nav: state => state.tag_nav,
      tags: state => state.tags.tags,
    }),
    allTags () {
      return {
        ...this.initial_tags,
        All: this.tags.filter(tag => {
          return !Object.keys(this.initial_tags).some(group => this.initial_tags[group].includes(tag));
        }),
      };
    },
    filteredTags: function () {
      return Object.keys(this.allTags).reduce((filtered, group) => {
        return Object.assign(filtered, { [group]: this.filterTags(this.allTags[group]) });
      }, {});
    },
    searchType () {
      return this.$route.query.type === '1' ? 1 : 0;
    },
    search () {
      return this.$route.query.search || '';
    },
  },

  watch: {
    '$route.query': {
      immediate: true,
      deep: true,
      async handler (query) {
        const searchTags = this.search.split('-');

        if (this.search) {
          for (const group in this.selectedTags) {
            searchTags.forEach(tag => {
              const index = this.allTags[group].indexOf(tag);

              if (index !== -1 && this.selectedTags[group].indexOf(index) === -1) {
                this.selectedTags[group].push(index);
              }
            });
          }
        } else {
          for (const group in this.selectedTags) {
            this.selectedTags[group] = [];
          }
        }

        await this.fetchPhotos();
      },
    },
    selectedTags: {
      deep: true,
      handler () {
        const searchtag = this.generateSearchTag();

        this.$store.commit('set_details_state', {
          detailsPage_url: `/photo-browse?search=${searchtag}&type=${this.searchType}`,
          search_tag: searchtag,
          search_type: this.searchType,
        });
        this.$router.push({
          path: `/photo-browse?search=${searchtag}&type=${this.searchType}`,
        });
      },
    },
  },

  methods: {
    capitalizeTag (tag) {
      return tag.replace(/_/g, ' ').replace(/(?: |\b)(\w)/g, key => key.toUpperCase()).replace(/ And /g, ' and ');
    },
    filterTags (tags) {
      const filterLowercased = (this.tagFilter || '').toLowerCase();

      return tags.filter(tag => tag.toLowerCase().includes(filterLowercased));
    },
    changeSearchType () {
      this.$router.push({
        path: `/photo-browse?search=${this.search}&type=${1 - this.searchType}`,
      });
    },
    async fetchPhotos () {
      this.$store.commit('set_browse_loading', true);

      try {
        if (this.search) {
          await this.$store.dispatch('resources/search', { searchtag: this.search, type: this.searchType });
        } else {
          await this.$store.dispatch('resources/getresources');
        }
      } finally {
        this.$store.commit('set_browse_loading', false);
      }
    },
    generateSearchTag () {
      const searchTagsArray = [];

      for (const group in this.selectedTags) {
        const selectedIndices = this.selectedTags[group];
        const groupTags = this.allTags[group];

        searchTagsArray.push(...selectedIndices.map(index => groupTags[index]));
      }

      return searchTagsArray.join('-');
    },
    onHideNav () {
      this.$store.commit('set_tag_nav', false);
    },
  },
};
</script>
