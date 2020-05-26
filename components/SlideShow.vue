<template>
  <client-only>
    <vue-flux
    :options="vfOptions"
    :images="vfImages"
    :transitions="vfTransitions"
    :captions="vfCaptions"
    ref="slider">

    <template v-slot:preloader>
        <flux-preloader />
    </template>

    <template v-slot:caption>
        <flux-caption />
    </template>

    <template v-slot:controls>
        <flux-controls />
    </template>

    <template v-slot:pagination>
        <flux-pagination />
    </template>

    <!-- <template v-slot:index>
        <flux-index />
    </template> -->
    </vue-flux>
  </client-only>
</template>

<script>
import {
   VueFlux,
   FluxCaption,
   FluxControls,
   FluxIndex,
   FluxPagination,
   FluxPreloader,
  //  Transitions
} from 'vue-flux/dist-ssr/vue-flux.umd.min.js';
import 'vue-flux/dist-ssr/vue-flux.css';
import { mapState } from 'vuex'
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
      FluxCaption,
      FluxControls,
      FluxIndex,
      FluxPagination,
      FluxPreloader,
   },

   data: () => ({
      vfOptions: {
         autoplay: true
      },
      // vfImages: [],
      // vfTransitions: Transitions,
      // vfCaptions: [],
      vfTransitions: ['fade', 'kenburn', 'swipe', 'slide', 'waterfall','zip',
                    'blinds2d','blocks1','blocks2','concentric','warp','camera','cube',
                    'book','fall','wave','blinds3d','round1','round2','explode']
   }),
   computed: {
      ...mapState({
      resources: state => state.resources.resources,
    }),
    vfImages: function() {
      var images = [];
      this.resources.forEach(resource => {
        images.push(resource.url);
      });
      return images
    },
    vfCaptions: function() {
      var captions = [];
      this.resources.forEach(resource => {
        captions.push(resource.public_id);
      });
      return captions
    }
   },
  //  created() {
  //    this.vfImages = [];
  //    this.vfCaptions = [];
  //    this.resources.forEach(resource => {
  //      this.vfImages.push(resource.url);
  //      this.vfCaptions.push(resource.public_id);
  //     //  this.vfTransitions.push(transitions[getRandomInt(0, 20)]);
  //    });
  //  }
}
</script>
