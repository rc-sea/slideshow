<template>
  <div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cloudinary: null
    }
  },
  head() {
    return {
      script: [
        { 
          hid:'cloudinary',
          src:"https://widget.cloudinary.com/v2.0/global/all.js", 
          defer: true,
          callback: () => {
            console.log("CDN loaded");
            this.cloudinary = cloudinary;
            cloudinary.openUploadWidget({
              cloudName: 'louise', 
              uploadPreset: 'pob2zoec'}, (error, result) => { 
                if (!error && result && result.event === "success") { 
                  console.log('Done! Here is the image info: ', result.info); 
                  this.$router.replace({ path: `/photo-browse` });
                } else if (!error && result && result.event === "close"){
                  this.$router.replace({ path: `/photo-browse` });
                } else if (error) {
                  console.log(error); 
                }
              }
            )
          }
        }
      ]
    }
  }
}
</script>