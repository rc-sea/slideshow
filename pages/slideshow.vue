<template>
  <div>
    <default-app-bar #extension>
      <v-btn
        color="orange lighten-1"
        rounded
        @click="onBack"
      >
        <v-icon left>mdi-arrow-left</v-icon>
        Back
      </v-btn>
    </default-app-bar>
    <v-container>
      <slide-show />
    </v-container>
  </div>
</template>

<script>
import SlideShow from '../components/SlideShow';
import { mapState } from 'vuex';
import DefaultAppBar from '~/components/DefaultAppBar';

export default {
  components: {
    SlideShow,
    DefaultAppBar,
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
