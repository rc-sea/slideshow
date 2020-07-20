<template>
  <client-only>
    <vue-flux
      ref="slider"
      :images="vfImages"
      :options="vfOptions"
      :transitions="vfTransitions"
    >

      <template v-slot:preloader>
        <flux-preloader />
      </template>

      <template v-slot:controls>
        <flux-controls />
      </template>

    <!-- <template v-slot:pagination>
        <flux-pagination />
    </template> -->

    <!-- <template v-slot:index>
        <flux-index />
    </template> -->
    </vue-flux>
  </client-only>
</template>

<script>
import {
  VueFlux,
  // FluxCaption,
  FluxControls,
  // FluxIndex,
  // FluxPagination,
  FluxPreloader,
  //  Transitions
} from 'vue-flux/dist-ssr/vue-flux.umd.min.js';
import 'vue-flux/dist-ssr/vue-flux.css';
import { mapState } from 'vuex';
import cloudinaryUrl from '~/util/cloudinaryUrl';
// let VueFlux, FluxCaption, FluxControls, FluxIndex, FluxPagination, FluxPreloader;

// if (process.browser) {
//   const VF = require('vue-flux');
//   VueFlux = VF.VueFlux;
//   FluxCaption = VF.FluxCaption;
//   FluxControls = VF.FluxControls;
//   FluxIndex = VF.FluxIndex;
//   FluxPagination = VF.FluxPagination;
//   FluxPreloader = VF.FluxPreloader;
// }

export default {
  components: {
    VueFlux,
    FluxControls,
    // FluxIndex,
    // FluxPagination,
    FluxPreloader,
  },

  data: () => ({
    vfOptions: {
      autoplay: true,
      allowFullscreen: true,
      aspectRatio: '16:12',
    },
    // vfImages: [],
    // vfTransitions: Transitions,
    // vfCaptions: [],
    vfTransitions: ['kenburn'],
  }),
  computed: {
    ...mapState({
      resources: state => state.resources.resources,
    }),
    vfImages: function () {
      return this.resources.map(resource => cloudinaryUrl(resource, {
        width: 1600,
        height: 1200,
        crop: 'pad',
        background: 'black',
      }));
    },
  },
};
</script>
