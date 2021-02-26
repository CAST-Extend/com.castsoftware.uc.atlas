<template>
  <v-card min-height="300px" width="100%" class="pa-3">
    <v-card-title>Framework Assistant</v-card-title>
    <v-card-subtitle
      >Automatically analyze applications on-boarded.</v-card-subtitle
    >
    <v-card-text class="pa-0">
      <v-container>
        <v-row width="100%">
          <v-col cols="6">
            <v-card width="100%s">
              <v-card-title>Create a new Assistant</v-card-title>
              <v-card-text>
                <v-container fluid>
                  <v-row align="center">
                    <v-col cols="6">
                      <v-subheader>
                        Category to bind :
                      </v-subheader>
                    </v-col>

                    <v-col cols="6">
                      <v-select
                        v-model="selectedCategory"
                        :items="categoriesList"
                        :loading="loadingCategories"
                        label="Select category"
                        persistent-hint
                        single-line
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row align="center">
                    <v-col cols="6">
                      <v-subheader>
                        Actions to execute :
                      </v-subheader>
                    </v-col>

                    <v-col cols="6">
                      <v-autocomplete
                        v-model="selectedActions"
                        :items="actionsList"
                        :loading="loadingActions"
                        label="Select actions"
                        multiple
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-spacer></v-spacer>
                    <v-btn
                      depressed
                      color="primary"
                      @click="createAssistant"
                      :loading="loadingAssistantCreation"
                    >
                      Add assistant new
                    </v-btn>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6" class="pl-6">
            <v-row class="mb-4"><h3>Running assistants:</h3></v-row>
            <v-row style="width: 100%">
              <v-card
                v-for="(a, i) in assistantsList"
                :key="i"
                class="my-2"
                width="100%"
                min-height="70px"
              >
                <v-card-text>
                  <v-container class="pa-0">
                    <v-row>
                      <v-col cols="10"
                      ><h3>Assistant {{ a.id }}</h3>
                      <p>
                        Monitoring : <strong>{{ a.category }}</strong> and
                        performing <strong>{{ a.actions }}</strong> actions
                      </p></v-col
                    >
                    <v-col cols="1">
                      <v-btn
                        class="mt-2"
                        fab
                        dark
                        x-small
                        color="red"
                        @click="removeAssistant(a)"
                      >
                        <v-icon dark>
                          mdi-trash-can-outline
                        </v-icon>
                      </v-btn>
                    </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { FrameworkAssistants } from "@/api/atlas/frameworkAssistants.controller";
import { IFrameworkAssistant } from "@/api/interface/atlas/FrameworkAssistant.interface";

export default Vue.extend({
  name: "FrameworkAssistant",

  data: () => ({
    // New item
    selectedCategory: "",
    selectedActions: [],

    loadingActions: false,
    actionsList: [],

    loadingCategories: false,
    categoriesList: [],

    // Assistants
    loadingAssistantCreation: false,

    loadingAssistants: false,
    assistantsList: [] as IFrameworkAssistant[],
  }),

  methods: {
    getListActions() {
      this.loadingActions = true;
      FrameworkAssistants.getPossibleActions()
        .then((res: string[]) => {
          this.actionsList = res;
        })
        .catch((err) => {
          console.error("Failed to retrieve the list of actions.", err);
        })
        .finally(() => {
          this.loadingActions = false;
        });
    },

    getListCategories() {
      this.loadingCategories = true;
      FrameworkAssistants.getFrameworksCategories()
        .then((res: string[]) => {
          this.categoriesList = res;
        })
        .catch((err) => {
          console.error("Failed to retrieve the list of categories.", err);
        })
        .finally(() => {
          this.loadingCategories = false;
        });
    },

    getListAssistants() {
      this.loadingAssistants = true;
      FrameworkAssistants.getAllAssistants()
        .then((res: IFrameworkAssistant[]) => {
          this.assistantsList = res;
        })
        .catch((err) => {
          console.error("Failed to retrieve the list of assistants.", err);
        })
        .finally(() => {
          this.loadingAssistants = false;
        });
    },

    removeAssistant(assistant: IFrameworkAssistant) {
      FrameworkAssistants.removeAssistant(assistant.id)
        .then((res) => {
          this.getListAssistants();
        })
        .catch((err) => {
          console.error("Failed to remove the assistant.", err);
        });
    },

    createAssistant() {
      if (this.selectedCategory == "" || this.selectedActions.length == 0)
        return;

      FrameworkAssistants.newAssistant(
        this.selectedCategory,
        this.selectedActions
      )
        .then((val: boolean) => {
          this.selectedCategory = "";
          this.selectedActions = [];
          this.getListAssistants();
        })
        .catch((err) => {
          console.error("Failed to create the assistant", err);
        })
        .finally(() => {
          this.loadingAssistantCreation = false;
        });
    },

    refresh() {
      this.getListActions();
      this.getListCategories();
      this.getListAssistants();
    },
  },

  mounted() {
    this.refresh();
  },
});
</script>
