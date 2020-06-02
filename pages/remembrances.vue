<template>
  <v-container max-width="1200" class="mb-2" fluid>
    <v-card 
        class="mx-auto"
        max-width="1200">
      <v-card-title class="new-headline">Remembrances</v-card-title>
      <v-card-subtitle class="display-1 font-weight-light">Share a remembrance of Louise</v-card-subtitle>
      <v-card-text class="headline">Whether it was the time you spent together, what she meant to you, your favorite or funniest moment, whatever you would want the world to know about her.</v-card-text>
      <comments title="Remembrances" id="comment_show"></comments>
      <v-row v-if="!user" dense align="center" justify="center"> 
        <v-btn normal color="orange darken-2" class="mb-3" @click="login">Add a remembrance</v-btn>
      </v-row>
      <comment-upload title="Remembrances" id="comment_upload"></comment-upload>
    </v-card>
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
      user: state => state.user.user
    })
  },
  methods: {
    login() {
      window.localStorage.setItem('redirect_url', this.$route.fullPath);
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
  font-size:60px;
  text-align: center;
}
</style>