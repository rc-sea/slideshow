<template>
  <v-container>
    <v-container fluid>
      <v-row dense justify="end">
        <v-btn class="mr-1 mb-2" primary @click="onBack">Back</v-btn>
      </v-row>
      <slide-show />
    </v-container>
  </v-container>
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
