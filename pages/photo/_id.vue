<template>
    <v-container
       max-width="1000"
        fluid>
        <v-card v-if="loading" class="mx-auto d-flex justify-md-center align-center" height="600" max-width="450">
          <v-progress-circular :size="150" :width="15" color="gray" indeterminate></v-progress-circular>
        </v-card>
        <v-card 
            v-else
            class="mx-auto"
            max-height="650"
            max-width="450">
            <cld-image :publicId="resource.public_id" secure="true">
              <cld-transformation gravity="faces" crop="fill" height="500" width="450" />
            </cld-image>
            <v-card-actions>
              <v-chip-group active-class="primary" multiple>
                <v-chip v-for="tag in resource.tags" :key="tag">{{ tag }}</v-chip>
              </v-chip-group>
                <v-spacer></v-spacer>
                <v-btn
                    v-for="icon in icons"
                    :key="icon"
                    class="mx-1"
                    dark
                    icon
                    >
                    <v-icon size="24px">{{ icon }}</v-icon>
                </v-btn>
            </v-card-actions>
            <v-row v-if="!user" dense align="center" justify="center"> 
              <v-btn normal color="primary" class="mb-3">Login To Comment</v-btn>
            </v-row>
        </v-card>
      <comments></comments>
    </v-container>
</template>


<script>
import Vue from 'vue'
import Cloudinary from 'cloudinary-vue'
import axios from 'axios'
import Comments from '~/components/Comments'

Vue.use(Cloudinary, {
  configuration: { cloudName: 'louise' }
});
const baseUrl = process.env.BASE_URL;

export default {
  data () {
    return {
      resource: null,
      loading: true,
      user: null,
      icons: [
        'mdi-facebook',
        'mdi-twitter',
        'mdi-instagram',
      ]
    }
  },
  async created() {
    console.log(this.$route.params.id);
    this.loading = true;
    try {
      let { data } = await axios.get(`${baseUrl}/api/detail`, {
        params: { 
          public_id: this.$route.params.id
        }
      })
      this.resource = data;
    }  catch(error) {
      console.log(error);
    }
    this.loading = false;
  },
  components: {
    Comments
  }
}
</script>