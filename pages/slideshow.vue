<template>
  <div>
    <v-app-bar
      color="blue-grey darken-4"
    >
      <v-btn
        color="orange lighten-1"
        rounded
        @click="onBack"
      >
        <v-icon left>mdi-arrow-left</v-icon>
        Back
      </v-btn>
    </v-app-bar>
    <v-container>
      <slide-show />
    </v-container>
  </div>
</template>

<script>
import SlideShow from '../components/SlideShow';
import { mapState } from 'vuex';

export default {
  components: {
    SlideShow,
  },
  computed: {
    ...mapState({
      detailsPage_url: state => state.detailsPage_url,
    }),
  },
  methods: {
    onBack () {
      this.$router.replace({ path: this.detailsPage_url });
    },
  },
};
</script>
