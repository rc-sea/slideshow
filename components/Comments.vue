<template>
  <v-list three-line v-if="comments">
    <v-list-item v-for="comment in comments" :key="comment.id">
      <v-list-item-avatar>
        <v-img :src="discourse_URL + comment.avatar_template"></v-img>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title v-html="comment.name || comment.username"></v-list-item-title>
        <v-list-item-subtitle v-html="comment.cooked"></v-list-item-subtitle>
        <v-divider></v-divider>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      discourse_URL: process.env.DISCOURSE_URL
    }
  },
  computed: {
    ...mapState({
      topics: state => state.comments.topics,
      comments: state => state.comments.posts,
      topic_id: state => state.comments.topic_id
    })
  },
  props: ['title'],
  async created() {
    console.log("**");
    this.$store.commit('comments/init');
    await this.$store.dispatch('comments/getTopics');
    this.$store.commit('comments/settopic_id', { title: this.title });
    if (this.topic_id) {
      await this.$store.dispatch('comments/getComments', { topic_id: this.topic_id});
    }
  },
}
</script>
