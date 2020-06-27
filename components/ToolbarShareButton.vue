<template>
  <v-menu offset-y>
    <template #activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        color="orange lighten-1 pa-2"
        rounded
        v-on="on"
      >
        <v-icon>mdi-share-variant</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="iconData in icons"
        :key="iconData.icon"
        dark
        dense
        icon
        @click="onShare(iconData)"
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

<script>
export default {
  name: 'ToolbarShareButton',

  data: () => ({
    icons: [
      { icon: 'mdi-facebook', color: '#3b5998', title: 'Facebook' },
      { icon: 'mdi-twitter', color: '#00acee', title: 'Twitter' },
      { icon: 'mdi-instagram', color: '#dd2a7b', title: 'Instagram' },
    ],
  }),

  methods: {
    share (iconData) {
      console.log(iconData);
    },
  },
};
</script>
