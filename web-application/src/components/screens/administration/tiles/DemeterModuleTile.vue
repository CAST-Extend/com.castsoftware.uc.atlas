<template>
  <v-card class="mb-6" height="350px">
    <v-card-text>
      <p class="display-1 text--primary">
        Demeter modules detected in {{ appName }}
      </p>
      <!-- Slide group if groups were detected -->
      <v-row v-if="demeterModule.lenght != 0">
        <template>
          <v-sheet class="mx-auto text--black" min-width="95%">
            <v-slide-group v-model="selectedGroupId" center-active show-arrows>
              <v-slide-item
                v-for="n in demeterModule"
                :key="n.id"
                v-slot="{ active, toggle }"
              >
                <v-btn
                  class="mx-2"
                  :input-value="active"
                  active-class="brown white--text"
                  depressed
                  rounded
                  @click="toggle"
                  @change="editDGroup = false"
                >
                  {{ n.name }}
                </v-btn>
              </v-slide-item>
            </v-slide-group>
          </v-sheet>
        </template>
      </v-row>
      <!-- No Demeter groups detected, invitation to group objects -->
      <v-row v-else> </v-row>

      <!-- Display message if no group is selected -->
      <v-row class="px-6 pt-4" v-if="selectedGroupId == null">
        <v-container class="d-flex flex-column" fill-height>
          <p class="text-body-1" v-if="demeterModule.lenght != 0">
            <b>Select a module to display informations</b>
          </p>
          <p class="text-body-1" v-if="demeterModule.lenght == 0">
            <b>No Demeter module were detected in {{ appName }}.</b>
          </p>
        </v-container>
      </v-row>
      <!-- Display a specific group -->
      <v-row class="px-6 pt-4" v-else>
        <v-container>
          <v-row class="d-flex flex-column">
            <h4 class="text-h5">
              Module : {{ getGroupByIndex(selectedGroupId).name }}
            </h4>
            <p class="text-body-1 pt-4">
              <b>Number of objects in the group:</b>
              {{ getGroupByIndex(selectedGroupId).numObjects }}<br />
            </p>
            <p class="text-body-1">
              <b>Technologies presents in this level:</b>
              <i>(Coming soon)</i><br />
            </p>
          </v-row>
          <v-row>
            <v-btn disabled color="warning">
              Rename
            </v-btn>
          </v-row>
        </v-container>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {
  GroupingController,
  Level5Group,
  ModuleGroup
} from "@/api/demeter/grouping.controller";
import { LevelController } from "@/api/demeter/grouping/level.controller";
import Vue from "vue";

export default Vue.component("DemeterModuleTile", {
  computed: {
    getApplicationName() {
      return this.$store.state.applicationName;
    }
  },

  mounted() {
    this.appName = this.$store.state.applicationName;
    if (this.appName.length != 0) {
      this.getDemeterModules();
    }
  },

  data: () => ({
    appName: "",
    loadingModule: false,
    loadingUndoGroup: false,
    demeterModule: [] as Level5Group[],
    selectedGroupId: null,

    /* D Groups */
    editDGroup: false,
    newGroupName: "",
    loadingRename: false,

    /**
     * Split the groups in a list of string
     */
    groupToList(groups: string[]) {
      if (groups == null) return "";

      const uniqueNames = [] as string[];
      groups.forEach(x => {
        const groupName: string = x.substring(6); // Remove demeter prefix
        if (uniqueNames.indexOf(groupName) == -1) uniqueNames.push(groupName);
      });
      return uniqueNames;
    },

    getGroupByIndex(id: number) {
      return this.demeterModule[id];
    },

    isUndoLoading(): boolean {
      return this.loadingUndoGroup;
    }
  }),

  methods: {
    /**
     * Get the Demeter groups present in one application
     */
    getDemeterModules() {
      this.loadingModule = false;
      GroupingController.getDemeterModules(this.appName)
        .then((res: ModuleGroup[]) => {
          this.loadingModule = true;
          this.demeterModule = res;
          console.log(
            `${res.length} groups found in application ${this.appName}.`
          );
        })
        .catch(err => {
          this.loadingModule = false;
          console.error("An error happened while querying Demeter groups", err);
        });
    },

    /**
     * Rename one specific level
     */
    rename(groupName: string, newName: string) {
      this.loadingRename = true;
      if (groupName != newName) {
        LevelController.renameLevel(this.appName, groupName, newName)
          .then((res: boolean) => {
            console.log("Successfuly renamed the level.", res);
            this.getDemeterModules();
          })
          .catch(err => {
            console.error(`Failed to rename level ${groupName}.`, err);
          })
          .finally(() => {
            this.loadingRename = false;
            this.editDGroup = false;
            this.newGroupName = "";
          });
      }
    }
  },

  watch: {
    getApplicationName(newApp) {
      this.appName = newApp;
      this.getDemeterModules();
    }
  }
});
</script>
