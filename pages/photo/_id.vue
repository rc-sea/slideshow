<template>
  <div>
    <v-app-bar
      color="blue-grey darken-4"
    >
      <v-btn
        color="orange lighten-1"
        rounded
        @click="onBack"
      >
        <v-icon left>mdi-arrow-left</v-icon>
        Back
      </v-btn>

      <v-spacer />

      <v-tooltip bottom>
        <template #activator="{ on: tooltipOn }">
          <v-menu :close-on-content-click="false" max-width="400" offset-y>
            <template #activator="{ on, attrs }">
              <v-btn
                v-bind="{ ...toolbarBtnAttrs, ...attrs }"
                color="orange"
                rounded
                v-on="{ ...on, ...tooltipOn }"
              >
                <v-badge :content="resource && resource.tags && resource.tags.length" :value="!!(resource && resource.tags && resource.tags.length)">
                  <v-icon>mdi-tag-multiple-outline</v-icon>
                </v-badge>
              </v-btn>
            </template>
            <template #default="menuData">
              <v-card v-if="resource">
                <v-card-text>
                  <div class="mb-4">
                    <v-chip v-for="tag in resource.tags" :key="tag" class="ma-1" :close="editor_role" :disabled="removingTags[tag]" small @click:close="removeTag(tag)">
                      {{ capitalizeTag(tag) }}
                    </v-chip>
                  </div>
                  <v-combobox
                    v-if="editor_role"
                    v-model="tagToAdd"
                    autofocus
                    color="success"
                    dense
                    hide-selected
                    :hint="addingTag ? 'Adding tag...' : ''"
                    :items="tagsToAdd"
                    :loading="addingTag"
                    outlined
                    placeholder="Select new tag"
                    prepend-icon="mdi-tag-plus-outline"
                    single-line
                    @change="addNewTag"
                  />
                  <v-subheader v-else>
                    Log in to edit tags
                  </v-subheader>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn small text @click="menuData.value = false"><v-icon left small>mdi-close</v-icon>Close</v-btn>
                </v-card-actions>
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
              <v-btn v-bind="{ ...toolbarBtnAttrs, ...attrs }" color="red" v-on="{ ...on, ...tooltipOn }">
                <v-badge :content="comments.length" :value="!!comments.length">
                  <v-icon>mdi-comment-multiple-outline</v-icon>
                </v-badge>
              </v-btn>
            </template>
            <template #default="menuData">
              <v-card>
                <v-card-text :style="`max-height: ${$vuetify.breakpoint.height * 0.8}px; overflow: auto`">
                  <div
                    v-if="comments.length<1"
                    class="caption grey--text text-center pa-7"
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
                <div class="pa-2">
                  <comment-upload id="comment_upload" :title="public_id" @save="menuData.value = false" />
                </div>
              </v-card>
            </template>
          </v-menu>
        </template>
        Comments
      </v-tooltip>

      <v-spacer />

      <toolbar-share-button />
    </v-app-bar>
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

Vue.use(Cloudinary, {
  configuration: { cloudName: 'louise' },
});

export default {
  components: {
    // Comments,
    CommentUpload,
    ToolbarShareButton,
  },
  data () {
    return {
      resource: null,
      loading: true,
      public_id: this.$route.params.id,
      tag_name: '',
      removingTags: {},
      tagToAdd: null,
      addingTag: false,
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
    }),
    tagsToAdd () {
      const allTags = this.tags || [];

      return (this.resource && this.resource.tags)
        ? allTags.filter(tag => !this.resource.tags.includes(tag))
        : allTags;
    },
  },
  async mounted () {
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
      const local_state = JSON.parse(window.localStorage.getItem('state'));

      const local_resources = JSON.parse(window.localStorage.getItem('resources'));

      this.$store.commit('set_details_state', local_state);
      this.$store.commit('resources/parse', local_resources);
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
      window.localStorage.setItem('redirect_url', this.$route.fullPath);
      window.localStorage.setItem('resources', JSON.stringify(this.resources_wrap));
      window.localStorage.setItem('state', JSON.stringify({
        search_tag: this.search_tag,
        search_type: this.search_type,
        detailsPage_url: this.detailsPage_url,
      }));
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
    capitalizeTag (tag) {
      return tag.replace(/_/g, ' ').replace(/(?: |\b)(\w)/g, key => key.toUpperCase()).replace(/ And /g, ' and ');
    },
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
    async addNewTag (tag) {
      if (this.addingTag) {
        return;
      }

      tag = tag.trim().replace(/\s\s+/g, ' ').replace(/ /g, '_').toLowerCase();
      if (!/^[a-z0-9]+[_a-z0-9]+$/.test(tag)) {
        alert('Tag can contain only letters, numbers, spaces and underscores');
        return;
      }

      await this.$nextTick();

      if (!this.resource.tags) {
        this.resource.tags = [];
      }

      this.addingTag = true;
      try {
        await axios.get('/api/uploadtag', {
          params: {
            public_id: this.public_id,
            tag,
          },
        });
        this.resource.tags.push(tag);
        this.tagToAdd = null;
      } catch (error) {
        console.log(error);
      } finally {
        this.addingTag = false;
      }
    },
    async removeTag (tag) {
      if (this.removingTags[tag]) return;

      this.$set(this.removingTags, tag, true);
      try {
        await axios.get('/api/removetag', {
          params: {
            public_id: this.public_id,
            tag: tag,
          },
        });
        this.resource.tags = this.resource.tags.filter(function (value, index, arr) { return value !== tag; });
      } catch (error) {
        console.log(error);
      } finally {
        this.$delete(this.removingTags, tag);
      }
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
}
</style>
