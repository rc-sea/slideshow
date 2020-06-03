<template>
  <div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      user: state => state.user.user,
      editor_role: state => state.user.editor_role
    }),
  },
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
            if (this.user && this.editor_role) {
              cloudinary.openUploadWidget({
              cloudName: 'louise', 
              uploadPreset: 'pob2zoec'}, (error, result) => { 
                if (!error && result && result.event === "success") { 
                  console.log('Done! Here is the image info: ', result.info); 
                  this.$router.push({ path: `/photo-browse` });
                } else if (!error && result && result.event === "close"){
                  this.$router.push({ path: `/photo-browse` });
                } else if (error) {
                  console.log(error); 
                }
              })
            } else {
              console.log('You are not allowed to upload a photo'); 
              this.$router.push({ path: `/photo-browse` });
            }
          }
        }
      ]
    }
  }
}
</script>