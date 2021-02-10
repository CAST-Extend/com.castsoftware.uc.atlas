<template>
  <v-container>
    <v-card width="100%" min-height="400px">
      <v-card-title>
        Configuration of the Artemis extensions
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row class="my-3">
            <PythiaParameters></PythiaParameters>
          </v-row>
          <v-divider></v-divider>
          <v-row class="my-3">
            <ArtemisParametersViewer></ArtemisParametersViewer>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import PythiaParameters from "@/components/screens/administration/components/PythiaParameters.vue";
import ArtemisParametersViewer from "@/components/screens/administration/components/ArtemisParametersViewer.vue";

export default Vue.extend({
  name: "ArtemisParameters",

  components: {
    PythiaParameters,
    ArtemisParametersViewer
  },

  data: () => ({})
});
</script>
