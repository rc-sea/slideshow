<template>
  <v-card
    class="mx-auto"
    max-width="1500"
  >
    <v-container fluid>
      <v-row dense>
        <v-col
          v-for="resource in data.resources"
          :key="resource.public_id"
          :cols="4"
        >
          <v-card>
             <cld-image 
              :publicId="resource.public_id" 
              secure="true" 
              >
               <cld-transformation 
                gravity="faces" 
                crop='fill' 
                height='250' 
                width='250' />
              </cld-image>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text>{{ resource.width }}</v-btn>
              <v-btn text>{{ resource.width }}</v-btn>

              <v-btn icon>
                <v-icon>mdi-share-variant</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import Vue from 'vue';
import Cloudinary from 'cloudinary-vue';

Vue.use(Cloudinary, {
    configuration: { cloudName: 'louise' }
})

const api_key = process.env.VUE_APP_CLOUDINARY_KEY
const api_secret = process.env.VUE_APP_CLOUDINARY_SECRET
const token = Buffer.from(`${api_key}:${api_secret}`, 'utf8').toString('base64')
export default {
  head() {
    return {
      title: 'Photo Listing'
    }
  },
  async asyncData({ $axios, error }) {
    return await $axios
      .get('https://api.cloudinary.com/v1_1/louise/resources/image/tags/best', {
              headers: {
          'Authorization': `Basic ${token}`,
          'Access-Control-Allow-Origin': 'https://localhost:3000',
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        return {
          data: response.data
        }
      })
      .catch(e => {
        error({
          statusCode: 503,
          message: 'Unable to fetch events at this time. Please try again.'
        })
      })
  }
}
</script>
