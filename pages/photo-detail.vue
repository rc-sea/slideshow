<template>
    <v-container
       max-width="1000"
        fluid>
        <v-row>
            <v-col>
                <v-card 
                    class="mx-auto"
                    max-height="550"
                    max-width="450">
                    <v-img
                        :contain=true
                        height="450"
                        src="https://res.cloudinary.com/louise/image/upload/slides--86.jpg"
                    />
                    <v-card-actions>
                        <v-chip
                        class="ma-2"
                        color="indigo"
                        text-color="white"
                        >
                        <v-avatar left>
                            <v-icon>mdi-account-circle</v-icon>
                        </v-avatar>
                        louise
                        </v-chip>
                        <v-chip
                        class="ma-2"
                        color="green">
                        <v-avatar left>
                            <v-icon>mdi-camera</v-icon>
                        </v-avatar>
                        travel</v-chip>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

    </v-container>
</template>


