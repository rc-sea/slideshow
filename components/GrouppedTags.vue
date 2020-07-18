<template>
  <div>
    <template v-for="(_, group) in allTags">
      <div v-if="filteredTags[group].length" :key="group" class="mb-4">
        <v-subheader class="headline">
          {{ group }}
          <span v-if="selectedTags[group].length" style="text-transform: none">&nbsp;({{ selectedTags[group].length }}/{{ allTags[group].length }} selected)</span>
        </v-subheader>
        <v-chip-group
          active-class="success--text text--lighten-2"
          class="headline mx-4"
          column
          multiple
          :value="selectedTags[group]"
          @change="groupTags => updateSelectedTags(group, groupTags)"
        >
          <v-chip v-for="tag in filteredTags[group]" :key="tag" filter large>{{ capitalizeTag(tag) }} </v-chip>
        </v-chip-group>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { capitalizeTag, filterTags, popularTags } from '~/util/tags';

export default {
  props: {
    filter: {
      type: String,
      default: '',
    },
    selectedTags: {
      type: Object,
      default: () => {},
    },
  },

  computed: {
    ...mapState({
      tags: state => state.tags.tags,
    }),
    allTags () {
      return {
        ...popularTags,
        All: this.tags.filter(tag => {
          return !Object.keys(popularTags).some(group => popularTags[group].includes(tag));
        }),
      };
    },
    filteredTags: function () {
      return Object.keys(this.allTags).reduce((filtered, group) => {
        return Object.assign(filtered, { [group]: filterTags(this.allTags[group], this.filter) });
      }, {});
    },
  },

  methods: {
    capitalizeTag,
    updateSelectedTags (group, groupTags) {
      this.$emit('update:selected-tags', {
        ...this.selectedTags,
        [group]: groupTags,
      });
    },
  },
};
</script>

<style scoped>
.v-chip {
  height: 36px;
}
</style>
