<template>
  <v-container />
</template>

<script>
import { mapState } from 'vuex';

export default {
  data () {
    return {
      cloudinary: null,
    };
  },
  computed: {
    ...mapState({
      user: state => state.user.user,
      editor_role: state => state.user.editor_role,
    }),
  },
  head () {
    const uploadSettings = {
      cloudName: 'louise',
      uploadPreset: 'unsigned',
      sources: [
        'local',
        'camera',
        'facebook',
        'dropbox',
        'instagram',
        'google_drive',
      ],
      googleApiKey: '<image_search_google_api_key>',
      showAdvancedOptions: true,
      defaultSource: 'local',
      cropping: false,
      multiple: true,
      styles: {
        palette: {
          window: '#10173a',
          sourceBg: '#20304b',
          windowBorder: '#7171D0',
          tabIcon: '#79F7FF',
          inactiveTabIcon: '#8E9FBF',
          menuIcons: '#CCE8FF',
          link: '#72F1FF',
          action: '#5333FF',
          inProgress: '#00ffcc',
          complete: '#33ff00',
          error: '#cc3333',
          textDark: '#000000',
          textLight: '#ffffff',
        },
        fonts: {
          default: null,
          'sans-serif': {
            url: null,
            active: true,
          },
        },
      },
    };

    return {
      script: [
        {
          hid: 'cloudinary',
          src: 'https://widget.cloudinary.com/v2.0/global/all.js',
          defer: true,
          callback: () => {
            console.log('CDN loaded');
            this.cloudinary = cloudinary; // eslint-disable-line no-undef
            if (this.user && this.editor_role) {
              cloudinary.openUploadWidget(uploadSettings, (error, result) => { // eslint-disable-line no-undef
                if (!error && result && result.event === 'success') {
                  console.log('Done! Here is the image info: ', result.info);
                  this.$router.push({ path: '/photo-browse' });
                } else if (!error && result && result.event === 'close') {
                  this.$router.push({ path: '/photo-browse' });
                } else if (error) {
                  console.log(error);
                }
              });
            } else {
              console.log('You are not allowed to upload a photo');
              this.$router.push({ path: '/photo-browse' });
            }
          },
        },
      ],
    };
  },
};
</script>
