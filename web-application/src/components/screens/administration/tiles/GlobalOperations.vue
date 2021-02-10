<template>
  <v-card width="100%">
    <v-card-title class="display-1 text--primary">
      Global Operations
    </v-card-title>
    <v-card-text>
      <v-row class="px-4 my-4"
        >You can find here a list of different operations that will affect yout
        entire application.<br />Be careful, even is these operations can
        undone, make sure you'll not override your previous work.<br />
        Based on the current machine resources the following operations can take
        a while on large applications.</v-row
      >

      <v-divider></v-divider>
      <v-row></v-row>
      <!-- <v-row class="mx-2">
        <h3 class="charcoal--text my-2">Actions</h3>
        <v-card style="border: 2px solid charcoal; border-radius: 20px; ">
          <v-card-text>
            <v-row> </v-row>
          </v-card-text>
        </v-card>
      </v-row> -->
      <v-row class="my-3 mx-2">
        <h3 class="red--text my-2">Danger Zone</h3>
        <v-card style="border: 2px solid #e76f51; border-radius: 20px; ">
          <v-card-text>
            <v-row>
              <v-col cols="8">
                Replicate all the level view in the module module view.<br /><em
                  >This operation will erase the current modules view</em
                >
              </v-col>
              <v-col cols="4" fill-height>
                <v-btn
                  depressed
                  color="orange"
                  class="ma-auto"
                  :loading="loadReplication"
                  @click="replicateModuleView()"
                >
                  Replicate Levels
                </v-btn>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col cols="8">
                Undo all the Demeter levels in your application. This operations
                will erase all the changes made on this application levels with
                the demeter extension. <br />
                <em
                  >This operation can ask a lot of time on large
                  applications</em
                >
              </v-col>
              <v-col cols="4" fill-height>
                <v-btn class="ma-auto mt-2" depressed color="orange" disabled>
                  Undo all levels
                </v-btn>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col cols="8">
                Undo all the Demeter modules in you application. This operations
                will erase all the changes made on this application's modules
                with the demeter extension. <br />
                <em>( Coming soon )</em>
              </v-col>
              <v-col cols="4" fill-height>
                <v-btn class="ma-auto mt-2" depressed color="orange" disabled>
                  Undo all modules
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { GroupActionController } from "@/api/demeter/groupAction.controller";
import Vue from "vue";

export default Vue.extend({
  name: "GlobalOperations",

  computed: {
    getApplicationName() {
      return this.$store.state.applicationName;
    }
  },

  mounted() {
    this.appName = this.$store.state.applicationName;
  },

  data: () => ({
    // Loadings
    loadReplication: false,

    appName: ""
  }),

  methods: {
    replicateModuleView() {
      this.loadReplication = true;
      GroupActionController.replicateModuleView(this.appName)
        .catch(err => {
          console.error(
            "Failed to replicate the level view in module view.",
            err
          );
        })
        .finally(() => {
          this.loadReplication = false;
        });
    }
  },

  watch: {
    getApplicationName(newApp) {
      this.appName = newApp;
    }
  }
});
</script>
