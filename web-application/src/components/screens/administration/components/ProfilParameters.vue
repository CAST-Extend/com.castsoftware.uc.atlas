<template>
  <v-row class="my-3">
    <v-card width="100%">
      <v-card-title>
        Profiles
      </v-card-title>
      <v-card-subtitle
        >Select a profile that corresponds to the use you wish to make of the
        extension. This parameter will automatically change the parameters
        below.</v-card-subtitle
      >
      <v-card-text>
        <v-slide-group v-model="model" class="pa-4" mandatory show-arrows>
          <v-slide-item v-for="n in 2" :key="n" v-slot="{ active, toggle }">
            <v-card
              :color="active ? 'primary' : 'grey lighten-1'"
              class="ma-4"
              height="200"
              width="200"
              @click="toggle"
            >
              <v-row class="fill-height" align="center" justify="center">
                <v-scale-transition>
                  <h3>Cast Internal</h3>
                </v-scale-transition>
              </v-row>
            </v-card>
          </v-slide-item>
        </v-slide-group>
      </v-card-text>
    </v-card>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "HelloWorld",

  data: () => ({})
});
</script>
