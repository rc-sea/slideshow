<template>
  <div>
    <default-app-bar />
    <v-container>
      <v-card
        class="mx-auto" max-width="1500"
      >
        <v-container fluid>
          <v-row>
            <v-col
              cols="12"
              lg="4"
              md="4"
            >
              <v-card>
                <v-card-subtitle class="headline font-italic">
                  Coming soon
                </v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import DefaultAppBar from '~/components/DefaultAppBar';

export default {
  components: {
    DefaultAppBar,
  },
};
</script>
