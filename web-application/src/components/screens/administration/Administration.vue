<template>
  <v-container>
    <v-row>
      <v-tabs
        class="pt-3"
        v-model="tab"
        align-with-title
        fixed-tabs
        background-color="charcoal"
        dark
      >
        <v-tab v-for="item in items" :key="item.name">
          <v-icon class="mr-3" v-if="item.icon">{{ item.icon }}</v-icon>
          {{ item.name }}
        </v-tab>
      </v-tabs>
    </v-row>
    <v-row>
      <v-container class="my-10">
        <!-- Grouping operations -->
        <v-row v-if="tab == 0">
          <v-col cols="7" md="7" sm="12">
            <DemeterLevelsTile></DemeterLevelsTile>
            <DemeterModuleTile></DemeterModuleTile>
          </v-col>
          <v-col col="5" md="5" sm="12">
            <GlobalOperations></GlobalOperations>
          </v-col>
        </v-row>

        <!-- Parameters -->
        <v-row v-if="tab == 1">
          <Parameters></Parameters>
        </v-row>

        <!-- Artemis Configuration -->
        <v-row v-if="tab == 2">
          <ArtemisParameters></ArtemisParameters>
        </v-row>

        <!-- Tag Creator Studio -->
        <v-row v-if="tab == 3">
          <TagStudio></TagStudio>
        </v-row>
      </v-container>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import DemeterLevelsTile from "@/components/screens/administration/tiles/DemeterLevelsTile.vue";
import DemeterModuleTile from "@/components/screens/administration/tiles/DemeterModuleTile.vue";
import GlobalOperations from "@/components/screens/administration/tiles/GlobalOperations.vue";
import Parameters from "@/components/screens/administration/steps/Parameters.vue";
import TagStudio from "@/components/screens/administration/steps/TagStudio.vue";
import ArtemisParameters from "@/components/screens/administration/steps/ArtemisParameters.vue";

export default Vue.extend({
  name: "Administration",

  components: {
    DemeterLevelsTile,
    GlobalOperations,
    DemeterModuleTile,
    Parameters,
    TagStudio,
    ArtemisParameters
  },

  data: () => ({
    tab: 0,

    items: [
      {
        view: "GroupingStep",
        name: "Grouping",
        icon: "mdi-group"
      },
      {
        view: "ParametersStep",
        name: "Parameters",
        icon: "mdi-cogs"
      },
      {
        view: "ArtemisParameters",
        name: "Artemis Parameters",
        icon: "mdi-cogs"
      },
      {
        view: "TagStudio",
        name: "Tag creator studio",
        icon: "mdi-android-studio"
      }
    ]
  })
});
</script>
