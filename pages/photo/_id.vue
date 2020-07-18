<template>
  <div>
    <default-app-bar #extension>
      <v-btn
        color="indigo lighten-2"
        rounded
        @click="onBack"
      >
        <v-icon left>mdi-arrow-left</v-icon>
        <span class="hidden-sm-and-down">Back</span>
      </v-btn>

      <v-spacer />

      <v-tooltip bottom>
        <template #activator="{ on: tooltipOn }">
          <v-menu :close-on-content-click="false" max-width="400" offset-y>
            <template #activator="{ on, attrs }">
              <v-btn
                v-bind="{ ...toolbarBtnAttrs, ...attrs }"
                color="deep-purple lighten-2"
                rounded
                v-on="{ ...on, ...tooltipOn }"
              >
                <v-badge :content="resource && resource.tags && resource.tags.length" :value="!!(resource && resource.tags && resource.tags.length)">
                  <v-icon>mdi-tag-multiple-outline</v-icon>
                  <span class="hidden-sm-and-down">Tags</span>
                </v-badge>
              </v-btn>
            </template>
            <template #default="menuData">
              <v-card v-if="resource">
                <v-card-text>
                  <div class="mb-4">
                    <v-chip
                      v-for="tag in resource.tags"
                      :key="tag"
                      active-class="success--text text--lighten-3"
                      class="ma-1"
                      :close="editor_role"
                      :disabled="togglingTags[tag]"
                      :input-value="true"
                      @click:close="removeTag(tag)"
                    >
                      {{ capitalizeTag(tag) }}
                    </v-chip>
                  </div>

                  <template v-if="editor_role">
                    <v-text-field
                      v-model="tagsFilter"
                      autocomplete="off"
                      :autofocus="$vuetify.breakpoint.mdAndUp"
                      color="success"
                      hide-details
                      label="Filter tags"
                      large
                      name="tagsFilter"
                      outlined
                      placeholder="Filter tags"
                      prepend-inner-icon="mdi-magnify"
                      single-line
                      style="font-size: 1.5rem"
                    >
                      <template #append-outer>
                        <v-progress-circular v-if="addingNewTag" color="success" indeterminate size="24" />
                        <v-tooltip v-else bottom>
                          <template #activator="{ on, attrs }">
                            <v-icon v-bind="attrs" color="success" :disabled="!canAddNewTag || addingNewTag" v-on="on" @click="addNewTag">mdi-plus</v-icon>
                          </template>
                          Create a new tag
                        </v-tooltip>
                      </template>
                    </v-text-field>

                    <v-list v-if="filteredTags.length">
                      <v-virtual-scroll
                        v-if="isMounted"
                        #default="{ item: tag }"
                        height="300"
                        :item-height="40"
                        :items="filteredTags"
                      >
                        <v-list-item @click="toggleTag(tag)">
                          <v-list-item-action>
                            <v-progress-circular v-if="togglingTags[tag]" indeterminate size="24" />
                            <v-simple-checkbox v-else :value="(resource.tags || []).includes(tag)" />
                          </v-list-item-action>
                          <v-list-item-content>
                            <v-list-item-title>{{ capitalizeTag(tag) }}</v-list-item-title>
                          </v-list-item-content>
                          <v-list-item-action v-if="isPopular(tag)">
                            <v-icon color="green" small>mdi-star</v-icon>
                          </v-list-item-action>
                        </v-list-item>
                      </v-virtual-scroll>
                    </v-list>
                    <v-subheader v-else>Sorry, not tags found</v-subheader>
                  </template>

                  <v-subheader v-else>
                    Log in to edit tags
                  </v-subheader>
                </v-card-text>
                <card-actions icon="mdi-close" label="Close" @click="menuData.value = false" />
              </v-card>
            </template>
          </v-menu>
        </template>
        Tags
      </v-tooltip>

      <v-tooltip bottom>
        <template #activator="{ on: tooltipOn }">
          <v-menu :close-on-content-click="false" max-width="300" :min-width="$vuetify.breakpoint.xsOnly ? 240 : 600" offset-y>
            <template #activator="{ on, attrs }">
              <v-btn v-bind="{ ...toolbarBtnAttrs, ...attrs }" color="teal lighten-1" v-on="{ ...on, ...tooltipOn }">
                <v-badge :content="comments.length" :value="!!comments.length">
                  <v-icon>mdi-comment-multiple-outline</v-icon>
                  <span class="hidden-sm-and-down">Comments</span>
                </v-badge>
              </v-btn>
            </template>
            <template #default="menuData">
              <v-card>
                <v-card-text :style="`max-height: ${$vuetify.breakpoint.height * 0.8}px; overflow: auto`">
                  <div
                    v-if="comments.length<1"
                    class="body-1 text-center pa-7"
                  >No one commented yet!</div>

                  <div v-for="(comment, index) in comments" :key="index">
                    <v-divider v-if="index" class="mb-2" />
                    <div class="text--secondary">
                      <v-icon class="pr-1 text--secondary">mdi-account-circle</v-icon>
                      <span class="overline">{{ comment.name }}</span>
                    </div>
                    <div class="commentFormat" v-html="comment.cooked" />
                  </div>

                </v-card-text>
                <comment-upload id="comment_upload" autofocus :title="public_id" @save="menuData.value = false" />
              </v-card>
            </template>
          </v-menu>
        </template>
        Comments
      </v-tooltip>

      <v-spacer />

      <toolbar-share-button />
    </default-app-bar>
    <v-container class="mb-2" fluid max-width="1200">
      <v-card
        class="mx-auto"
        max-width="1000"
      >
        <v-skeleton-loader
          dark
          :loading="loading"
          max-width="1000"
          type="image, actions, list-item-avatar-three-line@2"
        >
          <template v-if="loading">
            <div />
          </template>
          <template v-else>
            <cld-image align="center" class="photo-container" :public-id="resource.public_id" secure="true">
              <cld-transformation crop="fit" height="700" width="800" />
              <v-btn class="prev-btn prev-next-btn" @click="onPrev">
                <v-icon x-large>mdi-chevron-left </v-icon>
              </v-btn>
              <v-btn class="next-btn prev-next-btn" @click="onNext">
                <v-icon x-large>mdi-chevron-right </v-icon>
              </v-btn>
            </cld-image>
          </template>
        </v-skeleton-loader>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import Cloudinary from 'cloudinary-vue';
import axios from 'axios';
// import Comments from '~/components/Comments';
import CommentUpload from '~/components/CommentUpload';
import ToolbarShareButton from '~/components/ToolbarShareButton';
import DefaultAppBar from '~/components/DefaultAppBar';
import { getLocalStorageValue, setLocalStorageValue } from '~/util/localStorage';
import { capitalizeTag, filterTags, popularTags } from '~/util/tags';
import CardActions from '~/components/CardActions';

Vue.use(Cloudinary, {
  configuration: { cloudName: 'louise' },
});

export default {
  components: {
    // Comments,
    CommentUpload,
    DefaultAppBar,
    ToolbarShareButton,
    CardActions,
  },
  data () {
    return {
      isMounted: false,
      tagsFilter: '',
      selectedTags: {
        ...Object.keys(popularTags).reduce((tags, group) => Object.assign(tags, { [group]: [] }), {}),
        All: [],
      },
      resource: null,
      loading: true,
      public_id: this.$route.params.id,
      tag_name: '',
      togglingTags: {},
      addingNewTag: false,
    };
  },
  computed: {
    ...mapState({
      user: state => state.user.user,
      editor_role: state => state.user.editor_role,
      resources: state => state.resources.resources,
      resources_wrap: state => state.resources,
      detailsPage_url: state => state.detailsPage_url,
      search_tag: state => state.search_tag,
      search_type: state => state.search_type,
      tags: state => state.tags.tags,
      topic_id: state => state.comments.topic_id,
      just_login: state => state.just_login,
      comments: state => state.comments.posts,
      toolbarBtnAttrs () {
        return {
          icon: this.$vuetify.breakpoint.xsOnly,
          outlined: this.$vuetify.breakpoint.xsOnly,
          rounded: this.$vuetify.breakpoint.smAndUp,
          class: 'mx-1 mx-sm-3',
        };
      },
      canAddNewTag () {
        const tag = this.sanitizeTag(this.tagsFilter || '');

        return tag.trim() !== '' && !this.tags.includes(tag);
      },
    }),
    tagsToAdd () {
      const allTags = this.tags || [];

      return (this.resource && this.resource.tags)
        ? allTags.filter(tag => !this.resource.tags.includes(tag))
        : allTags;
    },
    filteredTags () {
      const filteredTags = [...filterTags(this.tags, this.tagsFilter)];

      filteredTags.sort((a, b) => (this.isPopular(b) - this.isPopular(a)) || capitalizeTag(a).localeCompare(capitalizeTag(b)));

      return filteredTags;
    },
  },
  async mounted () {
    this.isMounted = true;
    this.loading = true;
    try {
      const { data } = await axios.get('/api/detail', {
        params: {
          public_id: this.public_id,
        },
      });

      this.resource = data;
    } catch (error) {
      console.log(error);
    }
    if (this.just_login) {
      this.$store.commit('set_just_login', false);

      this.$store.commit('set_details_state', getLocalStorageValue('state'));
      this.$store.commit('resources/parse', getLocalStorageValue('resources') || {});
    }

    this.$store.commit('comments/init');
    await this.$store.dispatch('comments/getTopics');
    this.$store.commit('comments/settopic_id', { title: this.public_id });
    if (this.topic_id) {
      await this.$store.dispatch('comments/getComments', { topic_id: this.topic_id });
    }

    this.loading = false;
  },
  methods: {
    login () {
      setLocalStorageValue('redirect_url', this.$route.fullPath);
      setLocalStorageValue('resources', this.resources_wrap);
      setLocalStorageValue('state', {
        search_tag: this.search_tag,
        search_type: this.search_type,
        detailsPage_url: this.detailsPage_url,
      });
      this.$auth.loginWith('auth0');
    },
    onCommentIcon () {
      if (this.comments.length) {
        this.$vuetify.goTo('#comment_show');
      } else {
        if (!this.user) {
          this.login();
        } else {
          this.$vuetify.goTo('#comment_upload');
        }
      }
    },
    capitalizeTag,
    isPopular: tag => popularTags.Favorites.includes(tag) || popularTags.Couples.includes(tag),
    onPrev () {
      this.PrevNext(0);
    },
    onNext () {
      this.PrevNext(1);
    },
    onBack () {
      console.log(this.detailsPage_url);
      this.$router.replace({ path: this.detailsPage_url });
    },
    sanitizeTag (tag) {
      return tag.trim().replace(/\s\s+/g, ' ').replace(/ /g, '_').toLowerCase();
    },
    async addNewTag () {
      const tag = this.sanitizeTag(this.tagsFilter);

      if (!/^[a-z0-9]+[_a-z0-9]+$/.test(tag)) {
        alert('Tag can contain only letters, numbers, spaces and underscores');
      }

      try {
        this.addingNewTag = true;
        await this.toggleTag(tag);
      } finally {
        this.addingNewTag = false;
      }
    },
    async toggleTag (tag) {
      if (this.togglingTags[tag]) {
        return;
      }

      try {
        this.$set(this.togglingTags, tag, true);

        if ((this.resource.tags || []).includes(tag)) {
          await this.removeTag(tag);
        } else {
          await this.addTag(tag);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.$delete(this.togglingTags, tag);
      }
      await this.$store.dispatch('tags/gettags');
    },
    async addTag (tag) {
      if (!this.resource.tags) {
        this.resource.tags = [];
      }

      await axios.get('/api/uploadtag', {
        params: {
          public_id: this.public_id,
          tag,
        },
      });
      this.resource.tags.push(tag);
    },
    async removeTag (tag) {
      await axios.get('/api/removetag', {
        params: {
          public_id: this.public_id,
          tag,
        },
      });
      this.resource.tags = this.resource.tags.filter(function (value, index, arr) { return value !== tag; });
    },
    async PrevNext (flag) {
      for (let i = 0; i < this.resources.length; i++) {
        if (this.resources[i].public_id === this.public_id) {
          if (flag === 0 && i > 0) {
            this.$router.replace({
              path: `/photo/${this.resources[i - 1].public_id}`,
            });
          } else if (flag === 1) {
            if (i < this.resources.length - 1) {
              this.$router.replace({
                path: `/photo/${this.resources[i + 1].public_id}`,
              });
            } else {
              await this.$store.dispatch('resources/searchmore', {
                searchtag: this.search_tag,
                type: this.search_type,
              });
              if (i < this.resources.length - 1) {
                this.$router.replace({
                  path: `/photo/${this.resources[i + 1].public_id}`,
                });
              }
            }
          }
        }
      }
    },
  },
  head () {
    return {
      title: 'Photo detail -- Remembering Louise',
      meta: [],
    };
  },
};
</script>

<style lang="scss" scoped>
.photo-container {
  position: relative;
}
.prev-next-btn {
  position: absolute;
  top: 45%;
  background: none !important;
  border: none;
  padding: 0 !important;
  border-radius: 50px;
  &.prev-btn {
    left: 10px;
  }
  &.next-btn {
    right: 10px;
  }
}
.btn-full {
  width: 100%;
}
.commentFormat{
   white-space: pre-line;
   padding-left: 32px;
   font-size: 1.1rem;
}
.v-virtual-scroll {
  scrollbar-width: thin;
}

.v-virtual-scroll::-webkit-scrollbar {
  width: 8px;
}

.v-virtual-scroll::-webkit-scrollbar-thumb,
.v-virtual-scroll::-webkit-scrollbar-track {
  border-radius: 4px;
}

.v-virtual-scroll::-webkit-scrollbar-thumb {
  background: #666;
}

.v-virtual-scroll::-webkit-scrollbar-track {
  background: #ccc;
}
</style>
