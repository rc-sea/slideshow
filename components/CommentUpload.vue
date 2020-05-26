<template>
  <v-list v-if="user">
    <v-list-item >
      <v-textarea
        v-model="text"
        label="Comment"
        outlined
        no-resize
        row-height="15"
      ></v-textarea>
    </v-list-item>
    <v-list-item>
      <v-btn color="primary" class="col-12" @click="onComment">Comment</v-btn>
    </v-list-item>
  </v-list>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';

export default {
  data() {
    return {
      text: ''
    }
  },
  computed: {
    ...mapState({
      topic_id: state => state.comments.topic_id,
      user: state => state.user.user
    })
  },
  props: ['title'],
  methods: {
    async onComment() {
      try {
        if (this.text.length) {
          const { data } = await axios.post(`/api/comment`, {
            text: this.text,
            user: this.user.username,
            title: this.title,
            topic_id: this.topic_id
          });
          if (data.topic_id) {
            this.$store.commit('comments/pushpost', { 
              name: this.user.name, 
              username: this.user.username, 
              avatar_template: this.user.avatar_template,
              cooked: this.text
            });  
          }
          this.text = '';
        }
      } catch(error) {
        console.log(error);
      }
    }
  }
}
</script>
