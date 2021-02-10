import Vue from "vue/types/umd";

<template>
  <v-app class="main-application">
    <v-navigation-drawer
      shaped
      class="side-bar"
      permanent
      dark
      expand-on-hover
      fixed
    >
      <v-list>
        <v-list-item class="ml-1" link>
          <v-list-item-content class="mx-auto">
            <v-list-item-title class="title">
              <v-icon color="#438FDA" class="mr-2">mdi-globe-model</v-icon>
              Atlas
            </v-list-item-title>
            <v-list-item-subtitle
              >Intelligence for CAST Imaging</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list nav dense>
        <v-list-item-group
          v-model="tab"
          mandatory
          active-class="activeNavigationElement"
        >
          <v-list-item v-for="(v, i) in items" v-bind:key="i" link>
            <v-list-item-icon>
              <v-icon class="pl-1" :color="tab == i ? '#ffffff' : '#a5a4a4'">{{
                v.icon
              }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title
              :color="tab == i ? '#ffffff' : '#a5a4a4'"
              class="text-uppercase"
              >{{ v.name }}</v-list-item-title
            >
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-list>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-list-item
                  link
                  @click="simpleHealthCheck()"
                  v-bind="attrs"
                  v-on="on && !onlineDatabase"
                >
                  <v-list-item-icon>
                    <v-icon v-if="onlineDatabase" color="green"
                      >mdi-database-check</v-icon
                    >
                    <v-icon v-if="!onlineDatabase" color="red"
                      >mdi-database-remove</v-icon
                    >
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title
                      >Database
                      {{
                        onlineDatabase ? "online" : "offline"
                      }}</v-list-item-title
                    >
                  </v-list-item-content>
                </v-list-item>
              </template>
              <span>Lost connection to the database</span>
            </v-tooltip>

            <v-list-item link href="https://github.com/Makunda/Demeter/wiki">
              <v-list-item-icon>
                <v-icon>mdi-information-outline</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Documentation</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item link @click="logout()">
              <v-list-item-icon>
                <v-icon>mdi-exit-to-app</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
      </template>
    </v-navigation-drawer>
    <v-row style="max-height: 80px">
      <v-toolbar
        class="ml-15 text--white top-toolbar"
        dark
        color="charcoal"
        min-width="50px"
        height="80px"
      >
        <v-toolbar-title class="ml-8 screen-title"
          >{{ items[tab].name }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-title class="mt-2">Application selection :</v-toolbar-title>
        <v-autocomplete
          v-model="applicationName"
          :loading="loadingApplication"
          :items="applicationList"
          item-text="name"
          cache-items
          class="mx-4 mt-2"
          flat
          hide-no-data
          hide-details
          label="Pick an application"
          solo-inverted
        ></v-autocomplete>
      </v-toolbar>
    </v-row>
    <v-row no-gutters>
      <component
        class="custom-container"
        :is="items[tab].screen"
        v-model="applicationName"
      ></component>
    </v-row>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

import {
  ApplicationController,
  ApplicationRecord,
} from "@/api/applications/application.controller";

import Administration from "@/components/screens/administration/Administration.vue";
import Enrichment from "@/components/screens/enrichment/Enrichment.vue";
import Recommendation from "@/components/screens/recommendation/Recommendation.vue";
import Frameworks from "@/components/screens/frameworks/Frameworks.vue";
import { Configuration } from "./Configuration";
import { UtilsController } from "./api/utils/utils.controller";

export default Vue.extend({
  name: "Application",

  components: {
    Enrichment,
    Administration,
    Recommendation,
    Frameworks,
  },

  mounted() {
    this.getApplicationList();
    this.healthcheck();
  },

  computed: {
    getCurrentView() {
      return this.$store.state.currentView;
    },
  },

  data: () => ({
    tab: 0,
    items: [
      {
        name: "Enrichment",
        screen: "Enrichment",
        icon: "mdi-hexagon-multiple",
      },
      {
        name: "Recommendations",
        screen: "Recommendation",
        icon: "mdi-file-cad",
      },
      {
        name: "Frameworks",
        screen: "Frameworks",
        icon: "mdi-package-variant-closed",
      },
      { name: "Administration", screen: "Administration", icon: "mdi-cog" },
    ],

    loadingApplication: true as boolean,
    applicationName: "" as string,
    applicationList: [] as ApplicationRecord[],

    onlineDatabase: false,
  }),

  methods: {
    /** Change the state of the application **/
    changeApplication(application: string) {
      this.applicationName = application;
      // Update store properties
      this.$store.state.applicationName = application;
      console.log("New sate of store ", this.$store.state);
    },

    getApplicationList() {
      this.loadingApplication = true;
      ApplicationController.getSortedApplications().then(
        (res: ApplicationRecord[]) => {
          this.applicationList = res;
          if (res.length != 0) {
            this.changeApplication(res[0].name);
          } else {
            this.applicationName = "No Application found";
          }

          this.loadingApplication = false;
        }
      );
    },

    simpleHealthCheck() {
      UtilsController.healthCheck()
        .then((res: boolean) => {
          this.onlineDatabase = res;
        })
        .catch((err) => {
          this.onlineDatabase = false;
        });
    },

    healthcheck() {
      UtilsController.healthCheck()
        .then((res: boolean) => {
          this.onlineDatabase = res;
        })
        .catch((err) => {
          this.onlineDatabase = false;
        })
        .finally(() => {
          setTimeout(
            function() {
              this.healthcheck();
            }.bind(this),
            5000
          );
        });
    },

    logout() {
      Configuration.deleteProperties();
      document.location.reload();
    },
  },

  watch: {
    applicationName: function() {
      this.changeApplication(this.applicationName);
    },

    tab: function() {
      this.$store.state.currentView = this.items[this.tab].name;
    },

    getCurrentView(newView) {
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].name === newView) {
          // Found a view with a matching name
          this.tab = i;
        }
      }

      // Do nothing if the view wasn't found
    },
  },
});
</script>

<style>
.screen-title {
  font-size: 40px;
  margin-top: 6px;
  font-weight: 400;
}

.floating-application {
  position: absolute;
  bottom: 10px;
  right: 40px;
}

.side-bar {
  min-width: 64px;
}

.custom-container {
  margin-top: 10px;
  min-width: 100% !important;
  padding: 0px !important;
  padding-left: 75px !important;
  max-width: 100% !important;
}

.main-application {
  position: relative;
}

.top-toolbar {
  min-height: 64px;
}

.activeNavigationElement {
  border-left: 3px solid white;
}
</style>
