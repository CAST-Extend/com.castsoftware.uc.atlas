<template>
  <v-container fluid>
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
      <v-container class="mx-auto mt-10">
        <component :is="items[tab].view"></component>
      </v-container>
    </v-row>

    <div id="notInstalledArtemis" v-if="diplayNotInstalled">
      <h2 class="ma-auto text--h2" id="Message">
        The Artemis extension is not installed on this instance.<br />
        You must install the Artemis extension to continue on this section.<br />
        Please install the extension from
        <a
          href="https://extend.castsoftware.com/#/extension?id=com.castsoftware.uc.artemis&version=2.0.0"
        >
          CAST Extend
        </a>
      </h2>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { AtlasController } from "@/api/atlas/atlas.controller";
import ArtemisViewer from "@/components/artemis/modules/ArtemisViewer.vue";
import DetectionExplorer from "@/components/artemis/modules/DetectionExplorer.vue";
import FrameworkReviewer from "@/components/artemis/modules/FrameworkReviewer.vue";
import CategoriesCreator from "@/components/artemis/modules/CategoriesCreator.vue";
import CustomsCreator from "@/components/artemis/modules/CustomsCreator.vue";

export default Vue.extend({
  name: "Frameworks",

  components: {
    ArtemisViewer,
    DetectionExplorer,
    FrameworkReviewer,
    CustomsCreator,
    CategoriesCreator
  },

  computed: {
    getApplicationName() {
      return this.$store.state.applicationName;
    }
  },

  data: () => ({
    loading: true,
    groupRecord: undefined as unknown,
    applicationName: "" as string,
    diplayNotInstalled: false as boolean,
    version: "",

    // Navigation
    tab: 0,
    items: [
      {
        view: "ArtemisViewer",
        name: "Discover",
        icon: "mdi-assistant"
      },
      {
        view: "FrameworkReviewer",
        name: "Review",
        icon: "mdi-magnify"
      },
      {
        view: "CategoriesCreator",
        name: "Categories",
        icon: "mdi-tag-multiple"
      },
      {
        view: "CustomsCreator",
        name: "Customs",
        icon: "mdi-fountain-pen-tip"
      },
      {
        view: "DetectionExplorer",
        name: "Operations",
        icon: "mdi-assistant"
      }
    ]
  }),

  mounted() {
    this.applicationName = this.$store.state.applicationName;
    console.log("Checking if the Artemis extension is installed..");
    AtlasController.getArtemisVersion()
      .then(async (version: string) => {
        this.version = version;
      })
      .catch(err => {
        console.error(
          "The Artemis extension wasn't detected. The  function will be limited. Please install the Artemis extension",
          err
        );
        this.diplayNotInstalled = true;
      });
  },

  watch: {
    getApplicationName(newApp) {
      this.applicationName = newApp;
    }
  }
});
</script>

<style>
#notInstalledArtemis {
  position: absolute;
  top: 0;
  left: 0;

  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.7);
}

#notInstalledArtemis #Message {
  display: block;
  color: white;
  text-align: center;
  position: absolute;

  top: 40%;
  right: 0;
  width: 100%;
}
</style>
