<template>
  <div>
    <default-app-bar />
    <v-container>
      <v-container class="mb-2" fluid max-width="1200">
        <v-card
          class="mx-auto"
          max-width="1200"
        >
          <div class="hidden-lg-and-up">
            <v-card-title class="new-headline">Share a Remembrance</v-card-title>
          </div>
          <div class="hidden-md-and-down">
            <v-card-title class="new-headline">Share a Remembrance</v-card-title>
          </div>      <v-card-text class="headline">Whether it was the time you spent together, what she meant to you, your favorite or funniest moment, whatever you would want the world to know about you and Louise.</v-card-text>
          <comments id="comment_show" title="Remembrances" />
          <v-row v-if="!user" align="center" dense justify="center">
            <v-btn class="mb-3" color="orange darken-2" normal @click="login">Add a remembrance</v-btn>
          </v-row>
          <comment-upload id="comment_upload" title="Remembrances" />
        </v-card>
      </v-container>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Comments from '~/components/Comments';
import CommentUpload from '~/components/CommentUpload';
import DefaultAppBar from '~/components/DefaultAppBar';
import { setLocalStorageValue } from '~/util/localStorage';

export default {
  components: {
    Comments,
    CommentUpload,
    DefaultAppBar,
  },
  computed: {
    ...mapState({
      user: state => state.user.user,
      resources_wrap: state => state.resources,
      search_tag: state => state.search_tag,
      search_type: state => state.search_type,
      detailsPage_url: state => state.detailsPage_url,
    }),
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
  },
};
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
