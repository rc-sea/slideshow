<template>
  <v-card class="mx-auto" max-width="1500" id="browse-card">
    <v-speed-dial v-model="fab" top right direction="bottom" transition="slide-y-reverse-transition" open-on-hover>
      <template v-slot:activator>
        <v-btn v-model="fab" color="orange darken-3" dark fab x-large>
          <v-icon v-if="fab">mdi-close</v-icon>
          <v-icon v-else>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-tooltip bottom v-if="total_count">
        <template v-slot:activator="{ on }">
          <v-btn fab dark x-large color="green" v-on="on" @click="slideshow">
            <v-icon x-large>mdi-movie-open-outline</v-icon>
          </v-btn>
        </template>
        <span>Start Slide Show</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn fab dark x-large color="indigo" v-on="on" @click="onTagNav">
            <v-icon x-large>mdi-image-search</v-icon>
          </v-btn>
        </template>
        <span>Browse by People and Tags</span>
      </v-tooltip>
    </v-speed-dial>
    <v-container fluid>
      <v-row v-if="loading" justify="center" class="loading-row" align="center">
        <v-progress-circular :size="200" :width="20" color="gray" indeterminate></v-progress-circular>
      </v-row>
      <v-row v-else dense>
        <v-col v-for="resource in resources" :key="resource.public_id" :cols="12" sm="6" md="6" lg="4">
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
        <v-btn large @click="loadmore" color="orange">
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
      moreloading: false,
      fab: false,
    }
  },
  async asyncData({ $axios, store, error }) {},
  computed: {
    ...mapState({
      tags: state => state.tags.tags,
      resources: state => state.resources.resources,
      total_count: state => state.resources.total_count,
      detailsPage_url: state => state.resources.detailsPage_url,
      tag_nav: state => state.tag_nav,
      loading: state => state.browse_loading
    }),
  },
  methods: {
    async init() {
      if (this.detailsPage_url !== window.location.pathname + '?' + window.location.search)
      {
        this.setloading(true)
        var { search, type } = this.$route.query
        if (search) {
          await this.$store.dispatch('resources/search', {
            searchtag: search,
            type: type
          })
        } else {
          await this.$store.dispatch('resources/getresources')
        }
        this.setloading(false)
      } else {
        this.setloading(false)
      }
      this.$store.commit('set_details_url', window.location.pathname + '?' + window.location.search);      
    },
    onTagNav() {
      this.$store.commit('set_tag_nav', true);
      console.log(this.tag_nav);
    },
    setloading(flag) {
      this.$store.commit('set_browse_loading', flag);
    },
    async loadmore() {
      let { search, type } = this.$route.query;

      this.moreloading = true;
      await this.$store.dispatch('resources/searchmore', {
        searchtag: search,
        type: type
      });
      this.moreloading = false;
    },
    slideshow() {
      this.$router.replace({
        path: `/slideshow`
      })
    }
  },
  created() {
    console.log(this.$route.params)
    console.log(this.$route.query)
    this.init()
  }
}
</script>

<style lang="scss" scoped>
.btn-slide {
  position: absolute;
  left: 50%;
}
.loading-row {
  height: 700px;
}

#browse-card {
  .v-speed-dial {
    position: absolute;
  }
  .v-btn--floating {
    position: relative;
  }
}
</style>