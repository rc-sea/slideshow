<template>
  <v-container fluid >
    <v-row dense justify="end">
      <v-btn @click="onBack" primary class="mr-1 mb-2">Back</v-btn>
    </v-row>
    <slide-show></slide-show>
  </v-container>
</template>

<script>
import SlideShow from '../components/SlideShow';
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState({
      detailsPage_url: state => state.detailsPage_url
    })
  },
  methods: {
    onBack() {
      this.$router.replace({path: this.detailsPage_url});
    }
  },
  components: {
    SlideShow
  }
}
</script>