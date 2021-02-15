<template>
  <v-card class="px-5 mb-5 pt-4" :disabled="disabledTile">
    <v-card-text>
      <v-row>
        <h5 class="text-h4 black--text">
          Automatic framework discovery
        </h5>
      </v-row>
      <v-row class="my-5">
        <p>
          The <i>Artemis : automatic framewok detector </i> your application and
          finds objects belonging to open-source components. It analyzes the
          most popular online repositories and Google, and thanks to its
          built-in automatic learning algorithm, it finds the best matches.
          <br />
          You can choose to activate or not these options. If no option is
          activated, the <i>Artemis : automatic framewok detector </i> will rely
          on it's own database to discover frameworks.
        </p>
      </v-row>
      <v-row class="mt-5">
        <h3>Actions:</h3>
      </v-row>
      <v-row class="d-flex flex-column">
        <v-switch
          class="mx-5"
          v-model="onlineMode"
          label="Online search : The framewok detection will parse Google, to discover frameworks. The frameworks detected are added to the configuration for future usage."
          color="persianGrey"
          :loading="loadingConfiguration || loadingOnlineMode"
          :disabled="loadingOnlineMode"
          @click="setOnlineMode()"
          hide-details
        ></v-switch>
        <v-switch
          class="mx-5"
          v-model="repositoryMode"
          label="Repository search : Parse most populars repositories as Github, Maven, etc.. "
          color="persianGrey"
          :loading="loadingConfiguration || loadingRepositoryMode"
          :disabled="loadingRepositoryMode"
          @click="setRepositoryMode()"
          hide-details
        ></v-switch>
        <v-switch
          class="mx-5"
          label="Interaction detection : Discover your own internals frameworks by detecting the pieces of code used by multiple applications. (Coming soon)"
          color="persianGrey"
          hide-details
          disabled
        ></v-switch>
        <v-checkbox
          class="mx-5"
          label="Send the results of this detection by mail. (Configure mails addresses in the admistration panel) (Coming soon)"
          disabled
        ></v-checkbox>
        <v-row align="center">
          <v-col cols="2">
            <v-subheader>
              <h3>Pick a language for discovery :</h3>
            </v-subheader>
          </v-col>

          <v-col cols="2">
            <v-select
              v-model="selectedLanguage"
              :items="availableLanguages"
              label="Language"
              persistent-hint
              return-object
              single-line
            ></v-select>
          </v-col>
        </v-row>
      </v-row>
      <v-row class="mt-3">
        <p class="ml-5">
          <b
            ><i
              ><v-icon color="persianGrey">mdi-information</v-icon> The current
              workspace of the framework detector is located under :
            </i></b
          >{{ workspacePath }}
          <br />
          You can change the workspace in the Administration section
        </p>
      </v-row>
      <v-row class="mt-3">
        <p class="ml-5">
          <b
            ><i
              ><v-icon color="persianGrey">mdi-information</v-icon> The current
              version of Artemis is :
            </i></b
          >{{ version }}
        </p>
      </v-row>
      <v-row class="my-5">
        <v-btn
          :loading="runningArtemis"
          color="charcoal"
          class="ma-2 white--text"
          @click="launchDetection()"
          :disabled="ongoingDetection != ''"
        >
          Launch detection
          <v-icon right dark>
            mdi-play
          </v-icon>
        </v-btn>
        <v-btn
          :disabled="!runningArtemis"
          color="brown"
          class="ma-2 white--text"
          @click="stopDetection()"
        >
          Stop detection
          <v-icon right dark>
            mdi-stop
          </v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="brown" class="ma-2 white--text" @click="checkStatus()">
          Reload status
          <v-icon right dark>
            mdi-reload
          </v-icon>
        </v-btn>
      </v-row>
      <v-row>
        <v-alert
          class="ma-2"
          width="100%"
          border="left"
          dense
          type="info"
          v-if="ongoingDetection && ongoingDetection != ''"
        >
          {{ ongoingDetection }}
        </v-alert>
        <v-alert
          class="ma-2"
          width="100%"
          border="left"
          dense
          type="error"
          v-if="errorDetection && errorDetection != ''"
        >
          {{ errorDetection }}
        </v-alert>
      </v-row>
      <v-divider></v-divider>
      <v-card class="my-6">
        <v-card-title>
          Result of the detection:
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-card-subtitle class="d-flex justify-end">
          <v-checkbox
            v-model="showOnlyFrameworks"
            label="Show only detected as Frameworks"
          ></v-checkbox>
        </v-card-subtitle>

        <v-data-table
          :loading="runningArtemis"
          :headers="headers"
          :items="filteredFrameworks"
          :items-per-page="20"
          :search="search"
          item-key="nema"
          class="elevation-3"
          style="width: 100%"
        >
        </v-data-table>
      </v-card>
    </v-card-text>
    <div v-if="diplayNotInstalled" id="NotInstalledArtemis">
      <h2 class="ma-auto text--h2" id="Message">
        The Artemis extension is not installed on this instance.<br />
        Please install the extension from
        <a
          href="https://extend.castsoftware.com/#/extension?id=com.castsoftware.uc.artemis&version=2.0.0"
        >
          CAST Extend
        </a>
      </h2>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { ArtemisController } from "@/api/artemis/artemis.controller";
import { AtlasController } from "@/api/atlas/atlas.controller";

import DetectionController from "@/api/artemis/detection.controller";
import {
  DetectionStatus,
  DetectionResult,
  Framework
} from "@/api/interface/ApiArtemis.interface";
import ConfigurationController from "@/api/configuration/configuration.controller";

export default Vue.extend({
  name: "ActionTileViewer",

  computed: {
    filteredFrameworks() {
      console.log(
        "Result size : " +
          this.resultDetection.filter(d => {
            return d.type == "Framework";
          }).length
      );

      if (this.showOnlyFrameworks) {
        return this.resultDetection.filter(d => {
          return d.type == "Framework";
        });
      } else {
        return this.resultDetection;
      }
    },

    getApplicationName() {
      return this.$store.state.applicationName;
    }
  },

  data: () => ({
    // Result table
    headers: [
      {
        text: "Framework",
        align: "start",
        sortable: true,
        value: "name"
      },
      { text: "Description", value: "description" },
      { text: "Category", value: "category" },
      { text: "Detected as ", value: "type" }
    ],
    showOnlyFrameworks: true as boolean,

    disabledTile: false as boolean,
    version: "Unknown" as string,
    diplayNotInstalled: false as boolean,

    // Loadings
    loadingConfiguration: false as boolean,
    loadingOnlineMode: false as boolean,
    loadingRepositoryMode: false as boolean,
    runningArtemis: false as boolean,

    // Errors
    errorOnlineMode: false as boolean,
    errorRepositoryMode: false as boolean,
    errorDetection: "",

    // Detection
    filterValidFramework: true,
    search: "",
    ongoingDetection: "",
    resultDetection: [] as Framework[],
    selectedLanguage: "",
    availableLanguages: [] as string[],
    checkingStatus: false,

    application: "" as string,

    onlineMode: true as boolean,
    repositoryMode: true as boolean,
    workspacePath: "" as string,

    // On destroy
    flaggedAsToDestroy: false
  }),

  methods: {
    /**
     * Get the configuration of Artemis
     */
    async getConfiguration() {
      this.loadingConfiguration = true;

      this.onlineMode = await ArtemisController.getOnlineMode();
      this.repositoryMode = await ArtemisController.getRepositoryMode();
      this.workspacePath = await ConfigurationController.getArtemisWorkspace();

      await ArtemisController.getSupportedLanguages()
        .then((res: string[]) => {
          console.log("Avaible languages are :" + res.join(";"));
          this.availableLanguages = res;
          this.selectedLanguage = res[0];
        })
        .catch(err => {
          console.error("Failed to retrieve languages.", err);
        });

      this.loadingConfiguration = false;
    },

    /**
     *  Set a new mode for the online parameter
     */
    setOnlineMode() {
      this.loadingOnlineMode = true;
      ArtemisController.setOnlineMode(this.onlineMode)
        .then((res: boolean) => {
          this.onlineMode = res;
        })
        .catch(err => {
          this.errorOnlineMode = true;
          console.error(
            "Failed to change online mode of Artemis Framework detector.",
            err
          );
        })
        .then(() => {
          this.loadingOnlineMode = false;
        });
    },

    /**
     * Change the mode of the repository
     */
    setRepositoryMode() {
      this.loadingOnlineMode = true;
      ArtemisController.setRepositoryMode(this.repositoryMode)
        .then((res: boolean) => {
          this.repositoryMode = res;
        })
        .catch(err => {
          console.error(
            "Failed to change the repository setting of Artemis.",
            err
          );
          this.errorRepositoryMode = true;
        })
        .then(() => {
          this.loadingOnlineMode = false;
        });
    },

    /**
     *  Get the status of the Detection
     */
    checkStatus() {
      if (this.checkingStatus) return;

      this.checkingStatus = true;
      DetectionController.getApplicationStatus(this.application)
        .then((res: DetectionResult) => {
          // If res is null, the application has no status
          if (res == null) return;

          // If the detection is successfully launched, set a timeout and wait for the response
          switch (res.status) {
            case DetectionStatus.Pending:
              this.ongoingDetection = `On-going detection for the ${this.application} application.`;
              this.runningArtemis = true;
              this.errorDetection = "";
              console.log(this.ongoingDetection);
              break;
            case DetectionStatus.Success:
              this.resultDetection = res.data;
              this.runningArtemis = false;
              this.errorDetection = "";
              this.ongoingDetection = "";
              break;
            case DetectionStatus.Failure:
              this.errorDetection =
                "An error occured during the detection. Please check the logs";
              this.ongoingDetection = "";
              this.runningArtemis = false;
              break;

            default:
              break;
          }
        })
        .catch(err => {
          console.error(
            `Failed to retrieve the status of the application ${this.application}.`,
            err
          );
          this.errorDetection = `Failed to retrieve the status of the application ${this.application}.`;
        })
        .finally(() => {
          this.checkingStatus = false;
        });
    },

    launchDetection() {
      this.displayErrorDetection = false;
      DetectionController.launchDetection(
        this.application,
        this.selectedLanguage
      )
        .then((res: boolean) => {
          // If the detection is successfully launched, set a timeout and wait for the response
          if (res) {
            this.runningArtemis = true;
          } else {
            throw new Error(
              "The server refused to launch the detection. Check the logs."
            );
          }
        })
        .catch(err => {
          console.error(
            `The analysis of the application ${this.application} failed to launch.`,
            err
          );
          this.errorDetection = err;
        });
    },

    stopDetection() {
      this.displayErrorDetection = false;
      DetectionController.cancelDetection(
        this.application,
        this.selectedLanguage
      )
        .then((res: boolean) => {
          // If the detection is successfully launched, set a timeout and wait for the response
          if (res) {
            this.runningArtemis = false;
          } else {
            throw new Error(
              "The server refused to stopped the detection. Check the logs."
            );
          }
        })
        .catch(err => {
          console.error(`Failed to stop the on-going analysis.`, err);
          this.errorDetection = `Failed to stop the on-going analysis. Error : ${err}`;
        });
    },

    constantStatusCheck() {
      if (this.diplayNotInstalled) return;
      this.checkStatus();
      if (this.flaggedAsToDestroy) return;
      setTimeout(this.constantStatusCheck, 3000);
    },

    cancelDetection() {
      // Todo
    }
  },

  mounted() {
    this.disabledTile = true;
    this.resultDetection = [];

    AtlasController.getArtemisVersion()
      .then(async (version: string) => {
        this.version = version;
        this.disabledTile = false;
        this.application = this.$store.state.applicationName;
        await this.getConfiguration();
        await this.checkStatus();
      })
      .catch(err => {
        console.error(
          "The Artemis extension wasn't detected. The  function will be limited. Please install the Artemis extension",
          err
        );
        this.diplayNotInstalled = true;
      });

    this.constantStatusCheck();
  },

  beforeDestroy() {
    this.flaggedAsToDestroy = true;
  },

  watch: {
    getApplicationName(newApp) {
      this.application = newApp;
      this.resultDetection = [];
      this.runningArtemis = false;
      this.checkStatus();
    }
  }
});
</script>

<style>
#NotInstalledArtemis {
  min-width: 100%;
  min-height: 100%;
  position: absolute;

  top: 0;
  right: 0;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.7);
}

#NotInstalledArtemis #Message {
  display: block;
  color: white;
  text-align: center;
  position: absolute;

  top: 40%;
  right: 0;
  width: 100%;
}
</style>
