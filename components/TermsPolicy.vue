<template>
  <iframe id="iframe" name="iframe" :src="url" />
</template>

<script>
export default {
  props: {
    url: String,
  },
};
</script>

<style lang="scss" scoped>
#iframe {
  width: 100%;
  height: 100%;
  background: white;
  border: none;
}
</style>
