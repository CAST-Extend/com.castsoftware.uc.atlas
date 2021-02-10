<template>
  <v-card class="mx-auto">
    <v-card-text>
      <div>Demeter</div>
      <p class="display-1 text--primary">
        Demeter groups detected in {{ appName }}
      </p>
      <!-- Slide group if groups were detected -->
      <v-row v-if="demeterGroups.lenght != 0">
        <template>
          <v-sheet class="mx-auto text--black" min-width="95%">
            <v-slide-group v-model="selectedGroupId" center-active show-arrows>
              <v-slide-item
                v-for="n in demeterGroups"
                :key="n.id"
                v-slot="{ active, toggle }"
              >
                <v-btn
                  class="mx-2"
                  :input-value="active"
                  active-class="orange white--text"
                  depressed
                  rounded
                  @click="toggle"
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
          <p class="text-body-1">
            <b>Select a group to display informations</b>
          </p>
        </v-container>
      </v-row>
      <!-- Display a specific group -->
      <v-row class="px-6 pt-4" v-else>
        <v-container>
          <v-row>
            <p class="text-body-1">
              <b>Name of the group :</b>
              {{ getGroupByIndex(selectedGroupId).name }}<br />
              <b>Number of objects in the group :</b>
              {{ getGroupByIndex(selectedGroupId).numObjects }}<br />
              <b>Technology present in this group :</b>
              <i>Not implemented yet</i><br />
            </p>
          </v-row>
        </v-container>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn text color="persianGrey" @click="switchToAdminPanel()">
        Modify the groups in the administration panel
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import {
  GroupingController,
  Level5Group
} from "@/api/demeter/grouping.controller";
import { LevelController } from "@/api/demeter/grouping/level.controller";
import Vue from "vue";

export default Vue.component("DemeterGroupTile", {
  computed: {
    getApplicationName() {
      return this.$store.state.applicationName;
    }
  },

  mounted() {
    this.appName = this.$store.state.applicationName;
    this.getDemeterGroups();
  },

  data: () => ({
    appName: "",
    loadingGroups: false,
    loadingUndoGroup: false,
    demeterGroups: [] as Level5Group[],
    selectedGroupId: null,

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
      return this.demeterGroups[id];
    },

    isUndoLoading(): boolean {
      return this.loadingUndoGroup;
    }
  }),

  methods: {
    switchToAdminPanel() {
      this.$store.state.currentView = "Administration";
    },
    /**
     * Get the Demeter groups present in one application
     */
    getDemeterGroups() {
      this.loadingGroups = false;
      GroupingController.getDemeterGroupedLevels5(this.appName)
        .then((res: Level5Group[]) => {
          this.loadingGroups = true;
          this.demeterGroups = res;
          console.log(
            `${res.length} groups found in application ${this.appName}.`
          );
        })
        .catch(err => {
          this.loadingGroups = false;
          console.error("An error happened while querying Demeter groups", err);
        });
    },

    /**
     * Undo a specific demeter group
     */
    undoGroup(appName: string, groupName: string) {
      this.loadingUndoGroup = true;
      LevelController.undoGroupedLevel5(appName, groupName)
        .then((res: boolean) => {
          if(res) {
            this.getDemeterGroups();
          } else {
            console.error("Failed to undo the group.")
          }
        })
        .catch(err => {
          console.error(
            `Failed to undo group with name ${groupName} on application ${appName}.`,
            err
          );
        })
        .finally(() => {
          this.loadingUndoGroup = false;
        });
    }
  },

  watch: {
    getApplicationName(newApp) {
      this.appName = newApp;
      this.getDemeterGroups();
    }
  }
});
</script>
