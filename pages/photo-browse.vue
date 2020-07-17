<template>
  <div>
    <default-app-bar #extension>
      <v-spacer />

      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn v-bind="{ ...toolbarBtnAttrs, ...attrs }" color="blue lighten-1" v-on="on" @click="slideshow">
            <v-icon>mdi-movie-open-outline</v-icon>
            <span class="hidden-sm-and-down">Play Slideshow</span>
          </v-btn>
        </template>
        Start Slide Show
      </v-tooltip>

      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn v-bind="{ ...toolbarBtnAttrs, ...attrs }" color="info" v-on="on" @click="onTagNav">
            <v-badge :content="total_count" :value="!!total_count">
              <v-icon>mdi-image-search</v-icon>
              <span class="hidden-sm-and-down">Find people</span>
            </v-badge>
          </v-btn>
        </template>
        Browse by People and Tags
      </v-tooltip>

      <v-tooltip v-if="user && editor_role" bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="{ ...toolbarBtnAttrs, ...attrs }"
            color="purple lighten-2"
            :disabled="uploading !== false"
            :loading="uploading == null"
            v-on="on"
            @click="upload"
          >
            <v-icon>mdi-image-plus</v-icon>
            <span class="hidden-sm-and-down">Upload photos</span>
          </v-btn>
        </template>
        Upload photos
      </v-tooltip>

      <v-tooltip v-if="showUntagged" bottom>
        <template #activator="{ on, attrs }">
          <v-btn v-bind="{ ...toolbarBtnAttrs, ...attrs }" color="red" :disabled="!untagged_count" :loading="untagged_loading" v-on="on" @click="toggleUntagged(true)">
            <v-badge :content="untagged_count" :value="!!untagged_count">
              <v-icon>mdi-tag-plus-outline</v-icon>
              <span class="hidden-sm-and-down">Untagged</span>
            </v-badge>
          </v-btn>
        </template>
        Show untagged photos
      </v-tooltip>

      <v-spacer />

      <toolbar-share-button />
    </default-app-bar>

    <v-container>
      <v-card id="browse-card" class="mx-auto">
        <v-container fluid>
          <v-row v-if="resources_loading" align="center" class="loading-row" justify="center">
            <v-progress-circular color="gray" indeterminate :size="200" :width="20" />
          </v-row>
          <v-row v-else dense>
            <v-col v-for="resource in resources" :key="resource.public_id" :cols="12" lg="4" md="6" sm="6">
              <v-card>
                <nuxt-link :to="{ path: `photo/${resource.public_id}`}">
                  <cld-image :public-id="resource.public_id" secure="true">
                    <cld-transformation crop="fill" gravity="faces" height="350" width="350" />
                  </cld-image>
                </nuxt-link>
              </v-card>
            </v-col>
          </v-row>
          <v-row dense justify="center">
            <div v-intersect="loadmore" class="text-center my-12">
              <template v-if="moreloading">
                Loading more...
                <v-progress-circular indeterminate />
              </template>
            </div>
          </v-row>
        </v-container>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import Cloudinary from 'cloudinary-vue';
import ToolbarShareButton from '~/components/ToolbarShareButton';
import DefaultAppBar from '~/components/DefaultAppBar';

Vue.use(Cloudinary, {
  configuration: { cloudName: 'louise' },
});

export default {
  components: {
    DefaultAppBar,
    ToolbarShareButton,
  },

  async asyncData ({ $axios, store, error }) {},

  data () {
    return {
      moreloading: false,
      fab: false,
      uploading: false, // false - no upload, true - dialog opened, null - dialog opening
    };
  },

  computed: {
    ...mapState({
      user: state => state.user.user,
      editor_role: state => state.user.editor_role,
      tags: state => state.tags.tags,
      resources: state => state.resources.resources,
      total_count: state => state.resources.total_count,
      detailsPage_url: state => state.detailsPage_url,
      tag_nav: state => state.tag_nav,
      resources_loading: state => state.resources.resources_loading,
      untagged_count: state => state.resources.untagged_count,
      untagged_loading: state => state.resources.untagged_loading,
    }),
    speedDialProps () {
      const mobile = this.$vuetify.breakpoint.smAndDown;

      return {
        top: !mobile,
        bottom: mobile,
        direction: mobile ? 'top' : 'bottom',
        openOnHover: !mobile,
        fixed: mobile,
        absolute: !mobile,
      };
    },
    toolbarBtnAttrs () {
      return {
        icon: this.$vuetify.breakpoint.xsOnly,
        outlined: this.$vuetify.breakpoint.xsOnly,
        rounded: this.$vuetify.breakpoint.smAndUp,
        class: 'mx-1 mx-sm-3',
      };
    },
    showUntagged () {
      return !!this.user && this.editor_role;
    },
    queryJson () {
      return JSON.stringify(this.$route.query);
    },
    searchType () {
      return this.$route.query.type === '1' ? 1 : 0;
    },
    search () {
      return this.$route.query.search || '';
    },
  },

  watch: {
    '$route.fullPath': 'fetchPhotos',
    showUntagged: {
      immediate: true,
      async handler () {
        if (this.showUntagged) {
          await this.$store.dispatch('resources/untaggedCount');
        }
      },
    },
  },

  mounted () {
    if (process.browser) {
      this.fetchPhotos();
    }
  },

  methods: {
    async fetchPhotos () {
      if (this.search === '-' || this.$route.fullPath !== this.detailsPage_url) {
        this.$store.commit('set_details_state', {
          detailsPage_url: this.$route.fullPath,
          search_tag: this.search,
          search_type: this.searchType,
        });

        await this.$store.dispatch('resources/search', { searchtag: this.search, type: this.searchType });
      }
    },
    upload () {
      const uploadSettings = {
        cloudName: 'louise',
        uploadPreset: 'pob2zoec',
        sources: [
          'local',
          'camera',
          'facebook',
          'dropbox',
          'instagram',
          'google_drive',
        ],
        // googleApiKey: '<image_search_google_api_key>',
        showAdvancedOptions: true,
        defaultSource: 'local',
        cropping: false,
        multiple: true,
        styles: {
          palette: {
            window: '#7986CB',
            windowBorder: '#90A0B3',
            tabIcon: '#263238',
            menuIcons: '#5A616A',
            textDark: '#000000',
            textLight: '#FFFFFF',
            link: '#1A237E',
            action: '#FF620C',
            inactiveTabIcon: '#1A237E',
            error: '#F44235',
            inProgress: '#0078FF',
            complete: '#20B832',
            sourceBg: '#E4EBF1',
          },
          fonts: {
            default: null,
            'sans-serif': {
              url: null,
              active: true,
            },
          },
        },
      };

      if (this.uploading !== false) return;
      this.uploading = null; // loading dialog

      cloudinary.openUploadWidget(uploadSettings, (error, result) => {
        if (error) {
          console.error(error);
          alert(`Uploading error: ${error.statusText || error}`);
        } else if (result.event === 'display-changed' && result.info === 'shown') {
          this.uploading = true;
        } else if (result.event === 'close') {
          this.uploading = false;
        }
      });
    },
    onTagNav () {
      this.$store.commit('set_tag_nav', !this.tag_nav);
    },
    async loadmore () {
      const { search, type } = this.$route.query;

      this.moreloading = true;
      try {
        await this.$store.dispatch('resources/searchmore', {
          searchtag: search,
          type: type,
        });
      } catch (e) {
        console.error(e);
      } finally {
        this.moreloading = false;
      }
    },
    slideshow () {
      this.$router.replace({
        path: '/slideshow',
      });
    },
    toggleUntagged () {
      this.$store.commit('set_tag_nav', false);
      this.$router.push({
        path: `/photo-browse?search=-&type=${this.searchType}`,
      });
    },
  },
  head () {
    return {
      title: 'Browse Photos -- Remembering Louise',
      meta: [],
    };
  },
};
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
  .v-btn--floating {
    position: relative;
  }
}
</style>
