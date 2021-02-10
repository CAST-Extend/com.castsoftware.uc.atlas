<template>
  <v-card width="100%">
    <v-card-title class="text-h4">
      Configuration of Artemis
      <v-spacer></v-spacer>
      <v-btn icon color="green" @click="refresh()">
        <v-icon>mdi-cached</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-subtitle class="text-subtitle-1 ml-2 mt-2"
      >You can configure in this section the Artemis : Automatic Framework
      Detector extension.<br />
      You can find more information on this extension on the official Github :
      <a href="https://github.com/CAST-Extend/com.castsoftware.uc.atlas">
        https://github.com/CAST-Extend/com.castsoftware.uc.atlas
      </a>
    </v-card-subtitle>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <h3>Path to the Artemis workspace</h3>
            <p>
              Set the path to the folder containing the files of the Artemis
              Installation. <br />
            </p>
            <p v-if="updateSuccess != ''">
              {{ updateSuccess }}
            </p>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              v-model="artemisWorkspace"
              hint="Workspace of the Artemis extension ( ex : C:/User/John/Desktop/ArtemisWorkspace )"
              label="Artemis Workspace"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-btn
              class="mt-3"
              color="charcoal"
              dark
              @click="updateWorkspace()"
              :loading="updatingWorkspace"
            >
              Update the workspace
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import ConfigurationController from "@/api/configuration/configuration.controller";
import Vue from "vue";

export default Vue.extend({
  name: "ArtemisParametersViewer",

  data: () => ({
    artemisWorkspace: "",
    updatingWorkspace: false,
    updateSuccess: ""
  }),

  methods: {
    getArtemisWorkspace() {
      ConfigurationController.getArtemisWorkspace()
        .then((res: string) => {
          this.artemisWorkspace = res;
        })
        .catch(err => {
          console.error("Failed to get teh Artemis workspace", err);
        });
    },

    updateWorkspace() {
      this.updatingWorkspace = true;
      ConfigurationController.setArtemisWorkspace(this.artemisWorkspace)
        .then(async (res: string) => {
          await this.getArtemisWorkspace();
          this.updateSuccess = `Succesfully updated the workspace`;
          setTimeout(
            function() {
              this.updateSuccess = "";
            }.bind(this),
            4000
          );
        })
        .catch(err => {
          console.error("Failed to update teh Artemis workspace", err);
        })
        .finally(() => {
          this.updatingWorkspace = false;
        });
    },

    refresh() {
      this.getArtemisWorkspace();
    }
  },

  mounted() {
    this.getArtemisWorkspace();
  }
});
</script>
