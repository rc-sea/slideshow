<template>
  <v-list v-if="user">
    <v-list-item>
      <v-textarea
        v-model="text"
        label="Comment"
        no-resize
        outlined
        row-height="15"
      />
    </v-list-item>
    <v-list-item>
      <v-btn class="col-12" color="primary" @click="onComment">Comment</v-btn>
    </v-list-item>
  </v-list>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';

// const baseUrl = process.env.BASE_URL;

export default {
  props: {
    title: String,
  },
  data () {
    return {
      text: '',
    };
  },
  computed: {
    ...mapState({
      topic_id: state => state.comments.topic_id,
      user: state => state.user.user,
    }),
  },
  methods: {
    async onComment () {
      try {
        if (this.text.length) {
          const { data } = await axios.post('/api/comment', {
            text: this.text,
            user: this.user.username,
            title: this.title,
            topic_id: this.topic_id,
          });

          await this.$store.dispatch('comments/getComments', { topic_id: data.topic_id });
          this.text = '';
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
