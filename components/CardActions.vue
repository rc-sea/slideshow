<template>
  <div>
    <v-divider color="#444" />
    <v-card-actions class="pa-3" style="background: #333">
      <v-spacer />
      <v-btn
        :block="main"
        :color="main ? 'primary' : ''"
        :depressed="main"
        :disabled="disabled"
        :large="main"
        :loading="loading"
        :rounded="main"
        :text="!main"
        @click="$emit('click')"
      >
        <v-icon v-if="icon" left small>{{ icon }}</v-icon>
        {{ label }}
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
export default {
  name: 'CardActions',

  props: {
    disabled: Boolean,
    icon: String,
    label: {
      type: String,
      required: true,
    },
    loading: Boolean,
    main: Boolean,
  },
};
</script>
