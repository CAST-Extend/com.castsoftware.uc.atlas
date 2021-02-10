<template>
  <v-card height="350px" class="mb-6">
    <v-card-text>
      <p class="display-1 text--primary">
        Demeter levels 5 detected in {{ appName }}
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
          <p class="text-body-1">
            <b>Select a group to display informations</b>
          </p>
        </v-container>
      </v-row>
      <!-- Display a specific group -->
      <v-row class="px-6 pt-4" v-else>
        <v-container>
          <v-row class="d-flex flex-column">
            <h4 class="text-h5">
              Name : {{ getGroupByIndex(selectedGroupId).name }}
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
            <v-btn
              :loading="loadingUndoGroup"
              :disabled="loadingUndoGroup"
              color="warning"
              @click="undoGroup(getGroupByIndex(selectedGroupId).name)"
            >
              Undo group
            </v-btn>
            <!-- Rename modal -->
            <div class="text-center px-4">
              <v-dialog v-model="editDGroup" width="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="orange" dark v-bind="attrs" v-on="on">
                    Rename
                  </v-btn>
                </template>

                <v-card>
                  <v-card-title class="headline charcoal ">
                    <p class="white--text">
                      Rename level {{ getGroupByIndex(selectedGroupId).name }}
                    </p>
                  </v-card-title>

                  <v-card-text>
                    <p class="my-4">
                      Rename the level with current name
                      {{ getGroupByIndex(selectedGroupId).name }} on the level 5
                      view.
                    </p>
                    <v-text-field
                      class="my-4"
                      v-model="newGroupName"
                      label="New level name"
                      outlined
                    ></v-text-field>
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="charcoal" text @click="editDGroup = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      color="persianGrey"
                      class="white--text"
                      :loading="loadingRename"
                      @click="
                        rename(
                          getGroupByIndex(selectedGroupId).name,
                          newGroupName
                        )
                      "
                    >
                      Rename
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </v-row>
        </v-container>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {
  GroupingController,
  Level5Group
} from "@/api/demeter/grouping.controller";
import { LevelController } from "@/api/demeter/grouping/level.controller";
import Vue from "vue";

export default Vue.component("DemeterLevelsTile", {
  computed: {
    getApplicationName() {
      return this.$store.state.applicationName;
    }
  },

  mounted() {
    this.appName = this.$store.state.applicationName;
    if (this.appName.length != 0) {
      this.getDemeterGroups();
    }
  },

  data: () => ({
    appName: "",
    loadingGroups: false,
    loadingUndoGroup: false,
    demeterGroups: [] as Level5Group[],
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
      return this.demeterGroups[id];
    },

    isUndoLoading(): boolean {
      return this.loadingUndoGroup;
    }
  }),

  methods: {
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
    undoGroup(groupName: string) {
      this.loadingUndoGroup = true;
      LevelController.undoGroupedLevel5(this.appName, groupName)
        .then((res: boolean) => {
          if(res) {
            this.getDemeterGroups();
          } else {
            console.error(
            `Failed to undo the grouping for level ${groupName} on application ${this.appName}.`
          );
          }
        })
        .catch(err => {
          console.error(
            `Failed to undo group with name ${groupName} on application ${this.appName}.`,
            err
          );
        })
        .finally(() => {
          this.loadingUndoGroup = false;
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
            this.getDemeterGroups();
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
      this.getDemeterGroups();
    }
  }
});
</script>
