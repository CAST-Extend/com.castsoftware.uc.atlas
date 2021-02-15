<template>
  <v-card>
    <v-card-text>
      <v-row class="mx-4  mt-2 d-flex flex-column">
        <h5 class="text-h5 black--text">Grouping actions on configuration</h5>
        <p class="text-body-1 my-4">
          The grouping section is here to help you visualizing interst points in
          your application. It matches some predefined patterns, to give you
          quick ideas of what can be investigated in the application.<br />
          You can enrich this configuration manually, and create custom generics
          tags in the <i>Tag creator studio</i>.
          <br />
        </p>
      </v-row>

      <v-divider></v-divider>
      <v-row class="px-4 my-5">
        <v-toolbar dark color="#1D5D6B">
          <v-toolbar-title
            >Grouping operations: Check the configuration</v-toolbar-title
          >
          <v-spacer></v-spacer>
          <v-autocomplete
            :search-input.sync="searchActions"
            cache-items
            class="mx-4"
            flat
            hide-no-data
            hide-details
            label="Lookup for specific operations"
            solo-inverted
          ></v-autocomplete>
        </v-toolbar>
      </v-row>
      <v-row>
        <v-slide-group class="pa-4" active-class="success" show-arrows>
          <v-slide-item
            v-for="(n, index) in filteredPopularOperations"
            :key="index"
          >
            <GroupOperationsTile :groupAction="n"> </GroupOperationsTile>
          </v-slide-item>
        </v-slide-group>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import GroupOperationsTile from "@/components/screens/grouping/tiles/GroupOperationsTile.vue";
import {
  GroupAction,
  GroupActionController
} from "@/api/demeter/groupAction.controller";

export default Vue.extend({
  name: "ActionTileViewer",

  components: {
    GroupOperationsTile
  },

  data: () => ({
    // Loadings
    loadingActions: false,

    searchActions: "",
    searchLevels: "",

    application: "" as string,
    popularOperations: [] as GroupAction[],
    filteredPopularOperations: [] as GroupAction[]
  }),

  methods: {
    getActionList() {
      GroupActionController.getConfigurationActions(this.application)
        .then((res: GroupAction[]) => {
          this.popularOperations = res;
          this.filteredPopularOperations = res;
        })
        .catch(err => {
          console.error("Failed to retrieve the grouping actions", err);
        });
    }
  },

  mounted() {
    this.application = this.$store.state.applicationName;
    this.getActionList();
  },

  computed: {
    getApplicationName() {
      return this.$store.state.applicationName;
    }
  },

  watch: {
    getApplicationName(newApp) {
      this.application = newApp;
      this.getActionList();
    },

    searchActions: function(val: string) {
      if (!val || val.length == 0) {
        this.filteredPopularOperations = this.popularOperations;
      } else {
        // Filter the array  of application
        val = val.toLowerCase();
        this.filteredPopularOperations = this.popularOperations.filter(
          (x: GroupAction) => {
            return (
              x.title.toLowerCase().includes(val) ||
              x.description.toLowerCase().includes(val)
            );
          }
        );
      }
    }
  }
});
</script>
