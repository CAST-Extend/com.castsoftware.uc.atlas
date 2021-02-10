<template>
  <v-container>
    <v-row>
      <v-card min-height="300px" class="pa-3">
        <v-card-title>
          <v-row class="d-flex flex-column">
            <h3 class="text-h4 black--text mx-4 mb-4 my-3">
              Agents
            </h3>
            <p class="ml-4 text-body-1">
              Industrialize the grouping of tags. When actives, the agents will
              automatically merge the objects in CAST Imaging.
            </p>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-row>
            <!-- Level 5 assistant col -->
            <v-col cols="4" md="4" xl="3" sm="12">
              <LevelAgent></LevelAgent>
            </v-col>
            <v-col cols="4" md="4" xl="3" sm="12">
              <ModuleAgent></ModuleAgent>
            </v-col>
            <v-col cols="4" md="4" xl="3" sm="12">
              <ArchitectureAgent></ArchitectureAgent>
            </v-col>
            <v-col cols="4" md="4" xl="3" sm="12">
              <ViewAgent></ViewAgent>
            </v-col>
            <v-col cols="4" md="4" xl="3" sm="12">
              <FrameworkAgent></FrameworkAgent>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-row>
    <v-row class="pt-5">
      <AssistantsManager></AssistantsManager>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { GroupingController } from "@/api/demeter/grouping.controller";
import LevelAgent from "@/components/agents/LevelAgent.vue";
import ModuleAgent from "@/components/agents/ModuleAgent.vue";
import FrameworkAgent from "@/components/agents/FrameworkAgent.vue";
import ViewAgent from "@/components/agents/ViewAgent.vue";
import ArchitectureAgent from "@/components/agents/ArchitectureAgent.vue";
import AssistantsManager from "@/components/assistants/AssistantsManager.vue";

import Vue from "vue";
import { LevelController } from "@/api/demeter/grouping/level.controller";

export default Vue.component("GroupingTile", {
  components: {
    FrameworkAgent,
    ViewAgent,
    ArchitectureAgent,
    AssistantsManager,
    LevelAgent,
    ModuleAgent
  },

  computed: {
    getApplicationName() {
      return this.$store.state.applicationName;
    },
  },

  mounted() {
    this.application = this.$store.state.applicationName;
    this.daemonLevelState = this.$store.state.daemonLevelState;
    this.daemonModuleState = this.$store.state.daemonModuleState;
  },

  data: () => ({
    application: "",
    levelTags: [] as string[],
    moduleTags: [] as string[],

    countLevels: 0,
    countModule: 0,

    loading: false,

    daemonLevelState: true,
    daemonModuleState: true,
  }),

  methods: {
    toggleLevelDaemon() {
      this.daemonLevelState = this.$store.state.daemonLevelState = !this.$store
        .state.daemonLevelState;
      console.log(
        "New Level Daemon state is ",
        this.$store.state.daemonLevelState
      );
    },

    toggleModuleDaemon() {
      this.daemonModuleState = this.$store.state.daemonModuleState = !this
        .$store.state.daemonModuleState;
      console.log(
        "New Module Daemon state is ",
        this.$store.state.daemonModuleState
      );
    },

    toggleViewDaemon() {
      console.log("Not implemented yet !");
    },

    groupApplication(appName: string) {
      LevelController.executeGrouping(appName).then(() => {
        console.log(`Application ${appName} was sucessfully grouped !`);
      });
    },

    groupToList(groups: string[]) {
      if (groups == null) return "";

      const uniqueNames = [] as string[];
      groups.forEach((x) => {
        const groupName: string = x.substring(6);
        if (uniqueNames.indexOf(groupName) == -1) uniqueNames.push(groupName);
      });
      return uniqueNames;
    },
  },

  watch: {
    getApplicationName(newApp) {
      this.application = newApp;
    },
  },
});
</script>
