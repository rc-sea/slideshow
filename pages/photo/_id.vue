<template>
  <v-container>
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
              <v-btn absolute icon right top @click="onCommentIcon">
                <v-badge bordered color="green" :content="comments.length" overlap :value="comments.length" @click.prevent="$vuetify.goTo('#comment_show')">
                  <v-icon x-large>mdi-comment-text-outline</v-icon>
                </v-badge>
              </v-btn>
            </cld-image>
            <v-card-actions>
              <v-row>
                <v-col cols="8">
                  <v-chip-group v-if="editor_role">
                    <v-chip v-for="tag in resource.tags" :key="tag" close @click:close="onClose(tag)">{{ tag }}</v-chip>
                  </v-chip-group>
                  <v-chip-group v-else>
                    <v-chip v-for="tag in resource.tags" :key="tag">{{ tag }}</v-chip>
                  </v-chip-group>
                </v-col>
                <v-col cols="4">
                  <v-menu
                    :close-on-click="true"
                    :close-on-content-click="true"
                    :offset-y="true"
                    :open-on-hover="true"
                  >
                    <template v-slot:activator="{ on }">
                      <v-btn
                        color="primary"
                        dark
                        v-on="on"
                      >
                        Share
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        v-for="icon in icons"
                        :key="icon"
                        class="mx-4"
                        dark
                        icon
                        @click="onShare(icon)"
                      >
                        <v-icon size="24px">{{ icon }}</v-icon>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  <v-btn v-if="editor_role" color="primary" @click="dialog = true">Add Tags</v-btn>
                  <v-spacer />
                  <v-btn color="orange darken-2" @click="onBack">Return to Browse</v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
            <v-row v-if="!user" align="center" dense justify="center">
              <v-btn class="mb-3" color="primary" normal @click="login">Login To Comment</v-btn>
            </v-row>
            <comments id="comment_show" :title="public_id" />
            <comment-upload id="comment_upload" :title="public_id" />
          </template>
        </v-skeleton-loader>
      </v-card>

      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-card-title class="headline">Add tag for this photo</v-card-title>
          <v-card-text>
            <v-text-field v-model="tag_name" dark label="Input Tag Name" outlined />
            <v-btn class="btn-full" color="primary" @click="onAddTag">Add Tag</v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </v-container>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import Cloudinary from 'cloudinary-vue';
import axios from 'axios';
import Comments from '~/components/Comments';
import CommentUpload from '~/components/CommentUpload';

Vue.use(Cloudinary, {
  configuration: { cloudName: 'louise' },
});

export default {
  components: {
    Comments,
    CommentUpload,
  },
  data () {
    return {
      resource: null,
      loading: true,
      dialog: false,
      public_id: this.$route.params.id,
      tag_name: '',
      icons: [
        'mdi-facebook',
        'mdi-twitter',
        'mdi-instagram',
      ],
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
      just_login: state => state.just_login,
      comments: state => state.comments.posts,
    }),
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
    onShare (icon) {
      console.log(icon);
    },
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
    async onClose (tag) {
      console.log(tag);
      this.resource.tags = this.resource.tags.filter(function (value, index, arr) { return value !== tag; });
      try {
        await axios.get('/api/removetag', {
          params: {
            public_id: this.public_id,
            tag: tag,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    async onAddTag () {
      if (this.tag_name.length) {
        if (!this.resource.tags) {
          this.resource.tags = [];
        }
        this.resource.tags.push(this.tag_name);
        this.dialog = false;
        try {
          await axios.get('/api/uploadtag', {
            params: {
              public_id: this.public_id,
              tag: this.tag_name,
            },
          });
        } catch (error) {
          console.log(error);
        }
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
