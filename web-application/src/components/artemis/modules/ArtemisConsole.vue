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

      <v-row class="mt-9">
        <h3>Configuration:</h3>
      </v-row>
      <v-row class="d-flex flex-column">
        <v-switch
          class="mx-5"
          v-model="onlineMode"
          label="Online search : The framewok detection will parse Google, to discover frameworks. The frameworks detected are added to the configuration for future usages."
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

      <v-row class="my-5">
        <h3>Candidate applications:</h3>
      </v-row>
      <v-row class="mt-5">
        <v-card
          width="100%"
          max-height="500px"
          style="overflow-y: scroll"
          :loading="loadingCandidates"
        >
          <v-card-text>
            <v-container>
              <!-- Headers -->
              <v-row>
                <v-col cols="4">
                  Name of the application
                </v-col>
                <v-col cols="4">
                  Select the language of the detection
                </v-col>
              </v-row>

              <!-- rows  -->
              <span v-for="(can, i) in candidates" :key="i">
                <v-row>
                  <v-col class="pt-8" cols="4">
                    <strong>{{ can.application }}</strong>
                  </v-col>
                  <v-col
                    class="mb-2"
                    v-for="(lang, y) in can.languages"
                    :key="y"
                    cols="2"
                  >
                    <v-checkbox
                      v-model="selected[`option-${i}-${y}`]"
                      :label="lang"
                      color="indigo"
                      value="indigo"
                      hide-details
                      @click="
                        toPreQueue(
                          can.application,
                          lang,
                          selected[`option-${i}-${y}`]
                        )
                      "
                    ></v-checkbox>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </span>
            </v-container>
          </v-card-text>
        </v-card>
      </v-row>

      <v-row class="mt-10 mb-5">
        <h3>Send to queue :</h3>
      </v-row>
      <v-row class="mt-5">
        <v-card width="100%">
          <v-card-text>
            <v-chip-group active-class="primary--text" column>
              <v-chip v-for="(tag, i) in preQueue" :key="i">
                {{ `${tag.application} ( on ${listToString(tag.languages)})` }}
              </v-chip>
            </v-chip-group>
            <v-spacer></v-spacer>
            <v-btn depressed color="primary" @click="sendtoQueue">
              Send {{ preQueue.length }} applications to the queue
            </v-btn>
          </v-card-text>
        </v-card>
      </v-row>

      <v-row>
        <v-col cols="2" md="2">
          <v-row class="mt-10 mb-5">
            <h3>Current detection:</h3>
          </v-row>
          <v-row class="mt-5 mb-8">
            <v-card
              min-height="80px"
              width="100%"
              :loading="loadingOngoingQueue"
            >
              <v-card-text>
                <v-chip-group active-class="primary--text" column>
                  <v-chip
                    v-if="currentDetection && currentDetection !== 'undefined'"
                  >
                    {{
                      `${currentDetection.application} ( on ${currentDetection.languages})`
                    }}
                  </v-chip>
                </v-chip-group>
              </v-card-text>
            </v-card>
          </v-row>
        </v-col>
        <v-col class="pl-5" cols="10" md="8">
          <v-row class="mt-10 mb-5">
            <h3>On-going queue:</h3>
          </v-row>
          <v-row class="mt-5 mb-8">
            <v-card
              min-height="80px"
              width="100%"
              :loading="loadingOngoingQueue"
            >
              <v-card-text>
                <v-chip-group active-class="primary--text" column>
                  <v-chip v-for="(tag, i) in ongoingQueue" :key="i">
                    {{
                      `${tag.application} ( on ${listToString(tag.languages)})`
                    }}
                  </v-chip>
                </v-chip-group>
              </v-card-text>
            </v-card>
          </v-row>
        </v-col>
        <v-col class="pl-5" cols="2" md="2">
          <v-row class="mt-10 mb-5">
            <h3>Actions:</h3>
          </v-row>
          <v-row class="mt-5 mb-8">
            <v-card
              min-height="80px"
              width="100%"
              :loading="loadingOngoingQueue"
            >
              <v-card-text>
                <v-btn small tile color="error" @click="flushQueue">
                  <v-icon left>
                    mdi-eraser-variant
                  </v-icon>
                  Flush Queue
                </v-btn>
              </v-card-text>
            </v-card>
          </v-row>
        </v-col>
      </v-row>

      <v-divider></v-divider>
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
  Framework,
} from "@/api/interface/ApiArtemis.interface";
import ConfigurationController from "@/api/configuration/configuration.controller";
import { DetectionCandidate } from "@/api/interface/artemis/ApiDetectionCandidate.interface";
import { CandidateResults } from "@/api/interface/demeter/ApiCandidateResults.interface";

export default Vue.extend({
  name: "ArtemisConsole",

  computed: {
    filteredFrameworks() {
      console.log(
        "Result size : " +
          this.resultDetection.filter((d) => {
            return d.type == "Framework";
          }).length
      );

      if (this.showOnlyFrameworks) {
        return this.resultDetection.filter((d) => {
          return d.type == "Framework";
        });
      } else {
        return this.resultDetection;
      }
    },

    getApplicationName() {
      return this.$store.state.applicationName;
    },
  },

  data: () => ({
    // Result table
    headers: [
      {
        text: "Framework",
        align: "start",
        sortable: true,
        value: "name",
      },
      { text: "Description", value: "description" },
      { text: "Category", value: "category" },
      { text: "Detected as ", value: "type" },
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
    toDisplay: "",
    detection: null,

    application: "" as string,

    onlineMode: true as boolean,
    repositoryMode: true as boolean,
    workspacePath: "" as string,

    // Candidate applications
    loadingCandidates: false,
    candidates: [] as DetectionCandidate[],
    selected: [],

    loadingPrequeueUpload: false,
    preQueue: [] as DetectionCandidate[],

    loadingOngoingQueue: false,
    ongoingQueue: [] as DetectionCandidate[],
    currentDetection: null as DetectionCandidate,
    
    loadingFlush: false,

    // On destroy
    flaggedAsToDestroy: false,
  }),

  methods: {
    // functions
    listToString(items: string[]): string {
      return items.toString();
    },

    toPreQueue(application: string, language: string, appended: boolean) {
      if (appended) {
        // Add to the prequeue
        for (const i in this.preQueue) {
          if (
            this.preQueue[i].application == application &&
            this.preQueue[i].languages.indexOf(language) == -1
          ) {
            this.preQueue[i].languages.push(language);
            return;
          }
        }

        this.preQueue.push({ application: application, languages: [language] });
        return;
      } else {
        // remove from  the prequeue
        for (const i in this.preQueue) {
          if (
            this.preQueue[i].application == application &&
            this.preQueue[i].languages.indexOf(language) != -1
          ) {
            const index = this.preQueue[i].languages.indexOf(language);
            this.preQueue[i].languages.splice(index, 1);

            if (this.preQueue[i].languages.length == 0) {
              this.preQueue.splice(i, 1);
            }
            return;
          }
        }
      }
    },

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
        .catch((err) => {
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
        .catch((err) => {
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
        .catch((err) => {
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

    milisecondsToDhms(miliseconds) {
      const seconds = Number(miliseconds / 1000);
      const d = Math.floor(seconds / (3600 * 24));
      const h = Math.floor((seconds % (3600 * 24)) / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = Math.floor(seconds % 60);

      const dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
      const hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
      const mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
      const sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
      return dDisplay + hDisplay + mDisplay + sDisplay;
    },

    countDownTimer() {
      this.toDisplay = this.milisecondsToDhms(
        Date.now() - this.detection.timestampStart
      );
      setTimeout(this.countDownTimer, 1000);
    },

    /**
     *  Get the status of the Detection
     */
    checkStatus() {
      if (this.checkingStatus) return;

      this.checkingStatus = true;
      DetectionController.getApplicationStatus(this.application)
        .then((res: DetectionResult) => {
          console.log("Got status", res);
          // If res is null, the application has no status
          if (res == null) {
            this.ongoingDetection = "";
            this.errorDetection = "";
            return;
          }

          this.detection = res;

          // If the detection is successfully launched, set a timeout and wait for the response
          switch (res.status) {
            case DetectionStatus.Pending:
              this.ongoingDetection = `On-going detection for the ${this.application} application.`;
              this.runningArtemis = true;
              this.errorDetection = "";
              this.countDownTimer();
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
        .catch((err) => {
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

    getCandidates() {
      this.loadingCandidates = true;
      DetectionController.getDetectionCandidates()
        .then((res: DetectionCandidate[]) => {
          this.candidates = res;
          console.log(res);
        })
        .catch((err) => {
          console.error("Failed to get the candidates for the dection", err);
        })
        .finally(() => {
          this.loadingCandidates = false;
        });
    },

    async loadQueue() {
      this.loadingOngoingQueue = true;
      await DetectionController.getDetectionQueue()
        .then((res: DetectionCandidate[]) => {
          this.ongoingQueue = res;
        })
        .catch((err) => {
          console.error("Failed to retrieve the detection queue.", err);
        })
        .finally(() => {
          this.loadingOngoingQueue = false;
        });

      await DetectionController.getCurrent()
        .then((res: DetectionCandidate | null) => {
          console.log("Curent detection is ", res);
          this.currentDetection = res;
        })
        .catch((err) => {
          console.error("Failed to retrieve the currrent detection.", err);
        })
        .finally(() => {
          this.loadingOngoingQueue = false;
        });
    },

    sendtoQueue() {
      if (this.preQueue.length == 0) return;

      this.loadingPrequeueUpload = true;
      DetectionController.addCandidatesToDetection(this.preQueue)
        .then((val: number) => {
          this.preQueue = []; // clean the preQueue
        })
        .catch((err) => {
          console.error("Failed to add the Frameworks to the database", err);
        })
        .finally(() => {
          this.loadingPrequeueUpload = false;
        });
    },

    flushQueue() {
      this.loadingFlush = true;
      DetectionController.flushDetectionQueue()
        .then((val: boolean) => {
          this.ongoingQueue = []; // clean the preQueue
        })
        .catch((err) => {
          console.error("Failed to add the Frameworks to the database", err);
        })
        .finally(() => {
          this.loadingFlush = false;
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
        .catch((err) => {
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
        .catch((err) => {
          console.error(`Failed to stop the on-going analysis.`, err);
          this.errorDetection = `Failed to stop the on-going analysis. Error : ${err}`;
        });
    },

    constantStatusCheck() {
      if (this.diplayNotInstalled) return;
      this.loadQueue();
      if (this.flaggedAsToDestroy) return;
      setTimeout(this.constantStatusCheck, 5000);
    },

    cancelDetection() {
      // Todo
    },
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
      .catch((err) => {
        console.error(
          "The Artemis extension wasn't detected. The  function will be limited. Please install the Artemis extension",
          err
        );
        this.diplayNotInstalled = true;
      });

    this.constantStatusCheck();
    this.getCandidates();
    this.loadQueue();
  },

  beforeDestroy() {
    this.flaggedAsToDestroy = true;
  },
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
