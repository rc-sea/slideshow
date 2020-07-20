<template>
  <v-img :alt="title" :src="src" :title="title" />
</template>

<script>
import cloudinaryUrl from '~/util/cloudinaryUrl';

export default {
  props: {
    resource: {
      type: [String, Object],
      required: true,
    },
    transformation: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    title () {
      return typeof this.resource === 'string' ? this.resource : this.resource.public_id;
    },
    src () {
      return cloudinaryUrl(this.resource, this.transformation);
    },
  },
};
</script>
