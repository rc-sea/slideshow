<template>
    <iframe name="iframe" id="iframe" :src="url"></iframe>
</template>

<script>
export default {
  props: ['url']
}
</script>
<style lang="scss" scoped>
#iframe {
  width: 100%;
  height: 100%;
  background: white;
  border: none;
}
</style>