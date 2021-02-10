<template>
  <v-container>
    <v-row>
      <v-toolbar dark color="charcoal">
        <v-toolbar-title>Levels detected in the application</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-autocomplete
          :search-input.sync="searchLevels"
          cache-items
          class="mx-4"
          flat
          hide-no-data
          hide-details
          label="Filter the levels ..."
          solo-inverted
        ></v-autocomplete>
      </v-toolbar>
    </v-row>
    <v-row>
      <v-col cols="4" lg="3" md="4" v-for="(n, index) in levels" :key="index">
        <GroupTile
          :id="n.id"
          :name="n.name"
          :application="n.application"
          :numObjects="n.numObjects"
          :demeterGroup="n.demeterGroup"
        >
        </GroupTile>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {
  GroupingController,
  Level5Group
} from "@/api/demeter/grouping.controller";
import { LevelController } from "@/api/demeter/grouping/level.controller";
import GroupTile from "@/components/screens/grouping/tiles/GroupTile.vue";
import Vue from "vue";

export default Vue.component("LevelViewer", {
  components: {
    GroupTile
  },

  computed: {
    getApplicationName() {
      return this.$store.state.applicationName;
    }
  },

  data: () => ({
    // Loadings
    loadingGroups: false,
    loadingUndoGroup: false,

    // Filter
    searchLevels: "" as string,

    // Application
    applicationName: "" as string,

    levels: [] as Level5Group[],
    selectedGroupId: null,

    /**
     * Get the Demeter groups present in one application
     */
    getLevelGroups() {
      this.loadingGroups = false;
      LevelController.getAllLevels(this.applicationName)
        .then((res: Level5Group[]) => {
          this.loadingGroups = true;
          this.levels = res;
          console.log(
            `${this.levels.length} levels were loaded in application ${this.applicationName}.`
          );
        })
        .catch(err => {
          this.loadingGroups = false;
          console.error("An error happened while querying Demeter groups", err);
        });
    }
  }),

  methods: {
    /**
     * Undo a specific demeter group
     */
    undoGroup(appName: string, group: Level5Group) {
      // Ignore the group if it's not a demeter group
      if (!group.demeterGroup) return;

      this.loadingUndoGroup = true;
      LevelController.undoGroupedLevel5(appName, group.name)
        .then((res: boolean) => {
          if(res) {
            this.getLevelGroups();
          } else {
            console.log(
            `Failed to undo the grouping undone for level ${group} on application ${appName}.`
          );
          }
        })
        .catch(err => {
          console.error(
            `Failed to undo group with name ${group} on application ${appName}.`,
            err
          );
        })
        .finally(() => {
          this.loadingUndoGroup = false;
        });
    },

    /**
     * Split the groups in a list of string
     */
    groupToList(groups: string[]) {
      if (groups == null) return "";

      const uniqueNames = [] as string[];
      groups.forEach(x => {
        const groupName: string = x.substring(6);
        if (uniqueNames.indexOf(groupName) == -1) uniqueNames.push(groupName);
      });
      return uniqueNames;
    },

    refresh() {
      this.getLevelGroups();
    }
  },

  mounted() {
    this.applicationName = this.$store.state.applicationName;
    this.refresh();
  },

  watch: {
    getApplicationName(newApp) {
      this.applicationName = newApp;
      this.refresh();
    }
  }
});
</script>
