<template>
    <v-container max-width="1200" class="mb-2" fluid>
      <v-card 
        class="mx-auto"
        max-width="1000">
        <v-skeleton-loader 
          :loading="loading"
          max-width="1000"
          type="image, actions, list-item-avatar-three-line@2"
          dark>
            <template v-if="loading">
              <div></div>
            </template>
            <template v-else>
              <cld-image :publicId="resource.public_id" secure="true" align="center" class="photo-container">
                <cld-transformation  height="700" crop="fit" width="800" />
                <v-btn @click="onPrev" class="prev-btn prev-next-btn">
                  <v-icon x-large>mdi-chevron-left </v-icon>
                </v-btn>
                <v-btn @click="onNext" class="next-btn prev-next-btn">
                  <v-icon x-large>mdi-chevron-right </v-icon>
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
                      :open-on-hover="true"
                      :close-on-click="true"
                      :close-on-content-click="true"
                      :offset-y="true"
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
                            @click="onShare(icon)"
                            dark
                            icon
                            >
                            <v-icon size="24px">{{ icon }}</v-icon>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                    <v-btn v-if="editor_role" @click="dialog = true" color="primary">Add Tags</v-btn>
                    <v-btn @click="onBack">Back</v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
              <v-row v-if="!user" dense align="center" justify="center"> 
                <v-btn normal color="primary" class="mb-3" @click="login">Login To Comment</v-btn>
              </v-row>
              <comments :title="public_id"></comments>
              <comment-upload :title="public_id"></comment-upload>
            </template>
        </v-skeleton-loader>
      </v-card>

      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-card-title class="headline">Add tag for this photo</v-card-title>
          <v-card-text>
            <v-text-field label="Input Tag Name" outlined v-model="tag_name" dark></v-text-field>
            <v-btn @click="onAddTag" color="primary" class="btn-full">Add Tag</v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
</template>


<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import Cloudinary from 'cloudinary-vue'
import axios from 'axios'
import Comments from '~/components/Comments'
import CommentUpload from '~/components/CommentUpload'

Vue.use(Cloudinary, {
  configuration: { cloudName: 'louise' }
});
const baseUrl = process.env.BASE_URL;

export default {
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
      ]
    }
  },
  computed: {
    ...mapState({
      user: state => state.user.user,
      editor_role: state => state.user.editor_role,
      resources: state => state.resources.resources,
      detailsPage_url: state => state.detailsPage_url
    })
  },
  async created() {
    this.loading = true;
    try {
      let { data } = await axios.get(`/api/detail`, {
        params: { 
          public_id: this.public_id
        }
      })
      this.resource = data;
    }  catch(error) {
      console.log(error);
    }
    this.loading = false;
  },
  methods: {
    onShare(icon) {
      console.log(icon);
    },
    login() {
      window.localStorage.setItem('redirect_url', window.location.pathname);
      this.$auth.loginWith('auth0');
    },
    onPrev() {
      this.PrevNext(0);
    },
    onNext() {
      this.PrevNext(1);
    },
    onBack() {
      console.log(this.detailsPage_url);
      this.$router.replace({path: this.detailsPage_url});
    },
    async onClose(tag) {
      console.log(tag);
      this.resource.tags = this.resource.tags.filter(function(value, index, arr) { return value != tag });
      try {
        let { data } = await axios.get(`/api/removetag`, {
          params: { 
            public_id: this.public_id,
            tag: tag
          }
        })
      }  catch(error) {
        console.log(error);
      }
    },
    async onAddTag() {
      if (this.tag_name.length) {
        this.resource.tags.push(this.tag_name);
        this.dialog = false;
        try {
          let { data } = await axios.get(`/api/uploadtag`, {
            params: { 
              public_id: this.public_id,
              tag: this.tag_name
            }
          })
        }  catch(error) {
          console.log(error);
        }
      }
    },
    PrevNext(flag) {
      for (let i = 0; i < this.resources.length; i ++) {
        if (this.resources[i].public_id === this.public_id) {
          if (flag === 0 && i > 0) {
            this.$router.replace({
              path: `/photo/${this.resources[i - 1].public_id}`
            });
          } else if (flag === 1 && i < this.resources.length) {
            this.$router.replace({
              path: `/photo/${this.resources[i + 1].public_id}`
            });
          }
        }
      }
    }
  },
  components: {
    Comments,
    CommentUpload
  }
}
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