<template>
  <v-container>
    <v-container max-width="1200" class="mb-2" fluid>
      <v-card 
          class="mx-auto"
          max-width="1200">
            <div class="hidden-lg-and-up">
              <v-card-title class="new-headline">Share a Remembrance</v-card-title>
            </div>
            <div class="hidden-md-and-down">
              <v-card-title class="new-headline">Share a Remembrance</v-card-title>
            </div>      <v-card-text class="headline">Whether it was the time you spent together, what she meant to you, your favorite or funniest moment, whatever you would want the world to know about you and Louise.</v-card-text>
        <comments title="Remembrances" id="comment_show"></comments>
        <v-row v-if="!user" dense align="center" justify="center"> 
          <v-btn normal color="orange darken-2" class="mb-3" @click="login">Add a remembrance</v-btn>
        </v-row>
        <comment-upload title="Remembrances" id="comment_upload"></comment-upload>
      </v-card>
    </v-container>
  </v-container>
</template>


<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import Comments from '~/components/Comments'
import CommentUpload from '~/components/CommentUpload'

export default {
  computed: {
    ...mapState({
      user: state => state.user.user,
      resources_wrap: state => state.resources,
      search_tag: state => state.search_tag,
      search_type: state => state.search_type,
      detailsPage_url: state => state.detailsPage_url,
    })
  },
  methods: {
    login() {
      window.localStorage.setItem('redirect_url', this.$route.fullPath);
      window.localStorage.setItem('resources', JSON.stringify(this.resources_wrap));
      window.localStorage.setItem('state', JSON.stringify({
        search_tag: this.search_tag,
        search_type: this.search_type,
        detailsPage_url: this.detailsPage_url
      }));
      this.$auth.loginWith('auth0');
    }
  },
  components: {
    Comments,
    CommentUpload
  }
}
</script>
<style lang="scss" scoped>
.new-headline {
  font-family: 'Pinyon Script', cursive;
  font-size:48px;
}
.md-headline  {
  font-family: 'Pinyon Script', cursive;
  font-size:36px;
}
</style>