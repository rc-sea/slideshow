<template>
  <v-tooltip bottom>
    <template #activator="{ on: tooltipOn }">
      <v-menu offset-y>
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            color="orange lighten-1 pa-2"
            rounded
            v-on="{ ...on, ...tooltipOn }"
          >
            <v-icon>mdi-share-variant</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="iconData in shareIcons"
            :key="iconData.icon"
            dark
            dense
            :href="iconData.url"
            icon
            rel="noopener"
            target="_blank"
          >
            <v-list-item-content>
              <v-list-item-title class="text-right">
                {{ iconData.title }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon :color="iconData.color">{{ iconData.icon }}</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    Share...
  </v-tooltip>
</template>

<script>
import { createShareIcons } from '~/util/share.js';

export default {
  name: 'ToolbarShareButton',

  data () {
    return {
      shareIcons: createShareIcons(process.env.BASE_URL.replace(/\/$/, '') + this.$nuxt.$route.fullPath),
    };
  },

  methods: {
    share (iconData) {
      console.log(iconData);
    },
  },
};
</script>
