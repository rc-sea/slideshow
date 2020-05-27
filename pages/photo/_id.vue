<template>
    <v-container max-width="1000" class="mb-2" fluid>
        <v-card v-if="loading" class="mx-auto d-flex justify-md-center align-center" height="600" max-width="450">
          <v-progress-circular :size="150" :width="15" color="gray" indeterminate></v-progress-circular>
        </v-card>
        <v-card 
            v-else
            class="mx-auto"
            max-width="1000">
              <cld-image :publicId="resource.public_id" secure="true" class="photo-container">
                <cld-transformation gravity="faces" crop="fill" height="1000" width="1000" align="center"/>
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
                  <v-chip-group>
                    <v-chip v-for="tag in resource.tags" :key="tag">{{ tag }}</v-chip>
                  </v-chip-group>
                </v-col>
                <v-col cols="3">
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
                  <v-btn @click="onBack">Back</v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
            <v-row v-if="!user" dense align="center" justify="center"> 
              <v-btn normal color="primary" class="mb-3" @click="login">Login To Comment</v-btn>
            </v-row>
            <comments :title="public_id"></comments>
            <comment-upload :title="public_id"></comment-upload>
        </v-card>
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

export default {
  data () {
    return {
      resource: null,
      loading: true,
      public_id: this.$route.params.id,
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
      console.log(this.$auth);
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
  padding: 0;
  &.prev-btn {
    left: 10px;
  }
  &.next-btn {
    right: 10px;
  }
}
</style>