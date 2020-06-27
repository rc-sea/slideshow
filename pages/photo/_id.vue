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
        <v-icon>mdi-arrow-left</v-icon>
        Back
      </v-btn>
      <v-spacer />
      <v-menu :close-on-content-click="false" max-width="400" offset-y>
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            color="orange"
            rounded
            text
            v-on="on"
          >
            <v-icon left>mdi-tag-multiple-outline</v-icon>
            Tags
          </v-btn>
        </template>
        <template #default="menuData">
          <v-card v-if="resource && resource.tags">
            <v-card-text>
              <div class="mb-4">
                <v-chip v-for="tag in resource.tags" :key="tag" class="ma-1" :close="editor_role" :disabled="removingTags[tag]" small @click:close="removeTag(tag)">
                  {{ tag }}
                </v-chip>
              </div>
              <v-autocomplete
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
      <v-spacer />
      <v-btn
        color="green lighten-1"
        rounded
      >
        <v-badge bordered color="red" :content="comments.length" overlap :value="comments.length" @click.prevent="$vuetify.goTo('#comment_show')">
          <v-icon large>mdi-comment-multiple-outline</v-icon>
        </v-badge>
      </v-btn>
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
            <v-row v-if="!user" align="center" dense justify="center">
              <v-btn class="mb-3" color="primary" normal @click="login">Login To Comment</v-btn>
            </v-row>
            <comments id="comment_show" :title="public_id" />
            <comment-upload id="comment_upload" :title="public_id" />
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
import Comments from '~/components/Comments';
import CommentUpload from '~/components/CommentUpload';
import ToolbarShareButton from '~/components/ToolbarShareButton';

Vue.use(Cloudinary, {
  configuration: { cloudName: 'louise' },
});

export default {
  components: {
    Comments,
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
      just_login: state => state.just_login,
      comments: state => state.comments.posts,
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
</style>
