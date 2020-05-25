<template>
  <v-card class="mx-auto" max-width="1500">
    <v-container fluid>
      <v-row dense justify="end">
        <v-btn small @click="changeType">{{typeText}}</v-btn>
        <span class="brown total-number">{{ total_count }}</span>
      </v-row>
      <v-row dense>
        <v-chip-group v-model="selectedTags" active-class="primary" @change="onSelectTags" multiple>
          <v-chip v-for="tag in tags" :key="tag">{{ tag }}</v-chip>
        </v-chip-group>
      </v-row>
      <v-row v-if="loading" justify="center" class="loading-row" align="center">
        <v-progress-circular :size="200" :width="20" color="gray" indeterminate></v-progress-circular>
      </v-row>
      <v-row v-else dense>
        <v-col v-for="resource in resources" :key="resource.public_id" :cols="4">
          <v-card>
            <nuxt-link :to="{ path: `photo/${resource.public_id}`}">
              <cld-image :publicId="resource.public_id" secure="true">
                <cld-transformation gravity="faces" crop="fill" height="350" width="350" />
              </cld-image>
            </nuxt-link>
          </v-card>
        </v-col>
      </v-row>
      <v-row justify="center" dense>
        <v-btn normal @click="loadmore">
          <v-progress-circular v-if="moreloading" :size="20" :width="2" color="gray" indeterminate></v-progress-circular>
          <span v-else>Load More</span>
        </v-btn>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import Cloudinary from 'cloudinary-vue'
Vue.use(Cloudinary, {
  configuration: { cloudName: 'louise' }
})

let app
export default {
  head() {
    return {
      title: 'Photo Listing'
    }
  },
  data() {
    return {
      selectedTags: [],
      searchType: 0,
      loading: true,
      moreloading: false
    }
  },
  async asyncData({ $axios, store, error }) {},
  computed: {
    ...mapState({
      tags: state => state.tags.tags,
      resources: state => state.resources.resources,
      total_count: state => state.resources.total_count
    }),
    typeText: function() {
      return this.searchType === 0 ? 'Any Tag Matches' : 'All Tags Match'
    }
  },
  methods: {
    async init() {
      app = this
      this.setloading(true)
      await this.$store.dispatch('tags/inittags')
      var { search, type } = this.$route.query
      if (search) {
        this.searchType = type | 0
        search.split('-').forEach(tag => {
          var index = this.tags.indexOf(tag)
          if (this.selectedTags.indexOf(index) === -1) {
            this.selectedTags.push(index)
          }
        })

        await this.$store.dispatch('resources/search', {
          searchtag: search,
          type: type
        })
      } else {
        await this.$store.dispatch('resources/initresources')
      }
      this.setloading(false)
    },
    generateSearchTag() {
      let searchtag = this.tags[this.selectedTags[0]]
      for (var i = 1; i < this.selectedTags.length; i++) {
        searchtag += '-' + this.tags[this.selectedTags[i]]
      }
      return searchtag;
    },
    async onSelectTags() {
      console.log(this.selectedTags)
      this.setloading(true);

      if (this.selectedTags.length) {
        
        let searchtag = this.generateSearchTag();
        this.$router.replace({
          path: `/photo-browse?search=${searchtag}&type=${this.searchType}`
        })

        await this.$store.dispatch('resources/search', {
          searchtag: searchtag,
          type: this.searchType
        })
      } else {
        await this.$store.dispatch('resources/initresources')
      }

      this.setloading(false);
    },
    async changeType() {
      this.searchType = 1 - this.searchType
      if (this.selectedTags.length > 1) {
        await this.onSelectTags()
      }
    },
    setloading(flag) {
      this.loading = flag
    },
    async loadmore() {
      let { search, type } = this.$route.query;

      this.moreloading = true;
      await this.$store.dispatch('resources/searchmore', {
        searchtag: search,
        type: type
      });
      this.moreloading = false;
    }
  },
  created() {
    console.log(this.$route.params)
    console.log(this.$route.query)
    this.init()
  }
  // async fetch() {
  //   await this.$store.dispatch("tags/inittags");
  //   await this.$store.dispatch("resources/initresources");
  // }
}
</script>

<style lang="scss" scoped>
.loading-row {
  height: 700px;
}
.total-number {
  border-radius: 10px;
  margin-left: 10px;
  font-size: 15px;
  line-height: 28px;
  padding: 0 14px;
}
</style>