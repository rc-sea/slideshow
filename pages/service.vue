<template>
  <div>
    <v-card max-width="1500" class="mx-auto">
      <v-container fluid>
        <v-row>
          <v-col 
          cols="12"
          sm="7"
          lg="7">
            <v-card>
              <h2>Funeral Service and Events</h2>
              <v-card-subtitle class="headline">
                St. Theresa's Church, West Roxbury, MA<hr>June 3, 2020, 1 PM EDT
              </v-card-subtitle>
              <v-card-text class="title">
                <p>Due to concerns about COVID and limited ability to travel, the service will be virtual via the Zoom meeting app. </p>
                <p>If you are unfamiliar with Zoom calls, we will be holding a rehearsal meeting on Monday, June 1, at 1 PM EDT.</p>
              </v-card-text>
              <v-card-actions>
                <v-btn 
                  text 
                  href="./static/funeral.ics" 
                  download>
                    <v-icon large>mdi-calendar-star</v-icon>
                    Funeral invite
                </v-btn>
                <v-spacer />
                <v-btn 
                  text 
                  href="./static/rehearsal.ics" 
                  download>                      
                    <v-icon large>mdi-calendar-star</v-icon>
                    Rehearsal invite
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col>
            <v-card>
              <v-carousel
                cycle
                height="500"
                hide-delimiter-background
                show-arrows-on-hover
              >
                <v-carousel-item
                  v-for="(slide, i) in slides"
                  :key="i"
                >
                  <v-sheet
                    :color="colors[i]"
                    height="100%"
                  >
                    <v-row
                      class="fill-height"
                      align="center"
                      justify="center"
                    >
                      <div class="display-3">{{ slide }} Slide</div>
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
  export default {
    data () {
      return {
        colors: [
          'indigo',
          'warning',
          'pink darken-2',
          'red lighten-1',
          'deep-purple accent-4',
        ],
        slides: [
          'First',
          'Second',
          'Third',
          'Fourth',
          'Fifth',
        ],
        images: [
          'First',
          'Second',
          'Third',
          'Fourth',
          'Fifth',
        ],
      }
    },
  }
</script>
