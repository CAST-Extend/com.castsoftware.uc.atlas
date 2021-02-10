<template>
  <v-container>
    <ActionTileViewer></ActionTileViewer>
    <v-divider></v-divider>

    <v-card class="pa-5 mb-3">
      <v-card-text>
        <v-row>
          <h5 class="text-h5 black--text">
            Grouping exploration : Detach objects and investigate in CAST
            Imaging
          </h5>
        </v-row>
        <v-row class="my-5">
          <p>
            Here is a selection of actions that you can execute on your
            application. <br />
            The objects matching these use cases will be detached from the
            default levels and merged again to facilitate investigation and
            overview.
          </p>
        </v-row>

        <v-row>
          <v-skeleton-loader
            class="mx-auto"
            width="300"
            type="card"
          ></v-skeleton-loader>
          <v-skeleton-loader
            class="mx-auto"
            width="300"
            type="card"
          ></v-skeleton-loader>
          <v-skeleton-loader
            class="mx-auto"
            width="300"
            type="card"
          ></v-skeleton-loader>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import ActionTileViewer from "@/components/artemis/modules/ArtemisViewer.vue";

export default Vue.extend({
  name: "ExplorationStep",

  components: {
    ActionTileViewer
  },

  computed: {
    getApplicationName() {
      return this.$store.state.applicationName;
    }
  },

  mounted() {
    this.application = this.$store.state.applicationName;
  },

  data: () => ({
    application: ""
  }),

  methods: {},

  watch: {
    getApplicationName(newApp) {
      this.application = newApp;
    }
  }
});
</script>

<style>
#artemis-viewer {
  /* Size */
  min-height: 100px;

  /* Colors */
  color: black;
  background-color: white;

  /* Border */
  border: 2px inset #2a9d8f;
  border-radius: 20px;
}
</style>
