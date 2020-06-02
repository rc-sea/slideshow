<template>
  <v-container max-width="1200" class="mb-2" fluid>
    <v-card 
        class="mx-auto"
        max-width="1000">
      <h1 class="new-headline">Remembrances</h1>   
      <comments title="Remembrances" id="comment_show"></comments>
      <v-row v-if="!user" dense align="center" justify="center"> 
        <v-btn normal color="primary" class="mb-3" @click="login">Login To Comment</v-btn>
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
  font-size:48px;
  text-align: center;
}
</style>