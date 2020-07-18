<template>
  <div v-if="user">
    <v-textarea
      v-model="text"
      auto-grow
      :autofocus="autofocus && $vuetify.breakpoint.mdAndUp"
      class="ma-2"
      color="success"
      :hide-details="$vuetify.breakpoint.xsOnly"
      :hint="$vuetify.breakpoint.xsOnly ? '' : 'Ctrl-Enter saves the comment'"
      label="Comment"
      no-resize
      outlined
      persistent-hint
      placeholder="Write a comment"
      style="font-size: 1.3rem"
      @keydown.ctrl.enter="saveComment"
    />
    <card-actions
      :disabled="!(text || '').trim()"
      icon="mdi-comment-plus"
      label="Add comment"
      :loading="saving"
      main
      @click="saveComment"
    />
  </div>
  <v-subheader v-else>Login to comment</v-subheader>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';
import CardActions from '~/components/CardActions';

// const baseUrl = process.env.BASE_URL;

export default {
  components: {
    CardActions,
  },

  props: {
    autofocus: {
      type: Boolean,
      default: false,
    },
    title: String,
  },

  data () {
    return {
      text: '',
      saving: false,
    };
  },

  computed: {
    ...mapState({
      topic_id: state => state.comments.topic_id,
      user: state => state.user.user,
    }),
  },
  methods: {
    async saveComment () {
      this.saving = true;
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
        this.$emit('save');
      } catch (error) {
        console.log(error);
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<style scoped>
.v-textarea >>> .v-label.v-label--active {
  font-size: 1.3rem;
}

.v-textarea >>> textarea {
  padding-top: .5rem;
}
</style>
