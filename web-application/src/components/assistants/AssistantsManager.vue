<template>
  <v-card width="100%" min-height="300px" class="pa-3">
    <v-card-title>
      <v-row class="d-flex flex-column">
        <h3 class="text-h4 black--text mx-4 mb-4 my-3">
          Assistants
        </h3>
        <p class="ml-4 text-body-1">
          Automatize the actions of Demeter, Artemis and more, in your
          applications.
        </p>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-container>
        <!-- Predefined Assistans -->
        <v-row width="100%" class="mb-5">
          <FrameworkAssistant></FrameworkAssistant
        ></v-row>
        <!-- Regex Assistants -->
        <v-row width="100%">
          <RegexAssistants></RegexAssistants>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import RegexAssistants from "./RegexAssistants.vue";
import FrameworkAssistant from "./FrameworkAssistant.vue";

export default Vue.extend({
  name: "AssistantsManager",

  components: {
    RegexAssistants,
    FrameworkAssistant
  },

  data: () => ({})
});
</script>
