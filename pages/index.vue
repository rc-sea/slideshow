<template>
  <div>
    <v-card 
      max-width="1500" class="mx-auto">
      <v-container fluid>
        <v-row>
          <v-col 
          cols="12"
          md="4"
          lg="4">
            <v-card>
              <v-card-subtitle class="headline font-italic">
                Dedicated to Louise Carter, amazing mom, wife, friend, and photo archivist
              </v-card-subtitle>
              <v-btn x-large color="green" href="https://us02web.zoom.us/j/85836340855">Join Funeral Service</v-btn>
              <v-card-text class="title">
                Please click the button above to join the virtual funeral we're holding for Louise today at 1 PM EDT.  
              </v-card-text>
            </v-card>
          </v-col>
          <v-col>
            <v-card align="center">
              <v-carousel
                cycle
                height="550"
                hide-delimiters
              >
                <v-carousel-item
                  v-for="(image, i) in images"
                  :key="i"
                >
                  <v-sheet
                    color="black"
                    height="100%"
                  >
                    <v-row
                      class="fill-height"
                      align="center"
                      justify="center"
                    >
                      <v-col
                        md="12"
                        align="center"
                      >
                        <cld-image :publicId="images[i]" secure="true">
                          <cld-transformation crop="fill" gravity="faces" height="550" width="550" />
                        </cld-image>
                      </v-col>
                    </v-row>
                  </v-sheet>
                </v-carousel-item>
              </v-carousel>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import Cloudinary from 'cloudinary-vue'
import SlideShow from '~/components/SlideShow'
Vue.use(Cloudinary, {
  configuration: { cloudName: 'louise' }
})

  export default {
    data () {
      return {
        images: [
          'Slide_scans_801_ylfkeu',
          'Slide_scans_755_lx1mhv',
          'photos--448',
          'Slide_scans_801_fqbveb',
          'slides--86',
        ],
      }
    },
  }
</script>
