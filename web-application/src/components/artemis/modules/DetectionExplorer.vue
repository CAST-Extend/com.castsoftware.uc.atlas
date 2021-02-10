<template>
  <v-container>
    <v-row class="text-center pa-5">
      <h3 class="text-h4">
        Review the different detection operations previously launched
      </h3>
    </v-row>
    <v-row class="text-center pa-5">
      <v-spacer></v-spacer>
      <v-btn
        color="charcoal"
        class="ma-2 white--text"
        :disabled="checkingStatus"
        @click="reload()"
        dark
      >
        Reload
        <v-icon right dark>
          mdi-reload
        </v-icon>
      </v-btn>
    </v-row>
    <v-row class="mx-3 my-7">
      <v-card class="pa-3" style="width: 100%">
        <v-container>
          <v-row>
            <v-alert
              dense
              border="left"
              type="error"
              v-if="getOperationErrors != ''"
              width="100%"
            >
              {{ getOperationErrors }}
            </v-alert>
          </v-row>
          <v-row>
            <!-- Pending operations -->
            <div class="d-flex flex-column mx-1 my-3">
              <h5 class="text-h5">Pending operations</h5>
              <p v-if="pendingOperations.length == 0">
                No pending operation detected.
              </p>
            </div>
            <v-expansion-panels class="mb-6" style="width: 100%">
              <v-expansion-panel
                v-for="(item, i) in pendingOperations"
                :key="i"
              >
                <v-expansion-panel-header expand-icon="mdi-menu-down">
                  <h3>{{ item.application }}</h3>
                  <v-spacer></v-spacer>
                  <span style="max-width: 100px" class="text-body-1"
                    >Status :
                    <v-progress-circular
                      indeterminate
                      :width="3"
                      :size="20"
                      color="teal"
                    ></v-progress-circular
                  ></span>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <div class="d-flex flex-column">
                    <DetectionViewer v-bind:detection="item"> </DetectionViewer>
                    <div class="d-flex flex-row">
                      <v-btn
                        style="width: 150px"
                        class="float-right ma-3"
                        color="charcoal"
                        dark
                      >
                        Go to results
                      </v-btn>
                      <v-btn
                        style="width: 150px"
                        class="float-right my-3"
                        color="orange"
                        @click="stopDetection(item)"
                      >
                        Stop detection
                      </v-btn>
                    </div>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-row>
          <v-row>
            <!-- Successful operations -->
            <div class="d-flex flex-column mx-1 my-3">
              <h5 class="text-h5 ">Successful operations</h5>
              <p v-if="successOperations.length == 0">
                No successful operation detected
              </p>
            </div>
            <v-expansion-panels class="mb-6" style="width: 100%">
              <v-expansion-panel
                v-for="(item, i) in successOperations"
                :key="i"
              >
                <v-expansion-panel-header expand-icon="mdi-menu-down">
                  <h3>{{ item.application }}</h3>
                  <v-spacer></v-spacer>
                  <span style="max-width: 100px" class="text-body-1"
                    >Status :
                    <v-icon class="mx-1" color="teal"> mdi-check </v-icon></span
                  >
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <div class="d-flex flex-column">
                    <DetectionViewer v-bind:detection="item"> </DetectionViewer>
                    <div class="d-flex flex-row">
                      <v-btn
                        style="width: 150px"
                        class="float-right my-3"
                        color="charcoal"
                        dark
                      >
                        Go to results
                      </v-btn>
                    </div>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-row>
          <v-row>
            <!-- Failed operations -->
            <div class="d-flex flex-column mx-1 my-3">
              <h5 class="text-h5">Failed operations</h5>
              <p v-if="failedOperations.length == 0">
                No Failed operation detected
              </p>
            </div>
            <v-expansion-panels class="mb-6" style="width: 100%">
              <v-expansion-panel v-for="(item, i) in failedOperations" :key="i">
                <v-expansion-panel-header expand-icon="mdi-menu-down">
                  <h3>{{ item.application }}</h3>
                  <v-spacer></v-spacer>
                  <span style="max-width: 100px" class="text-body-1"
                    >Status :
                    <v-icon color="error">
                      mdi-alert-circle
                    </v-icon></span
                  >
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <div class="d-flex flex-column">
                    <DetectionViewer v-bind:detection="item"> </DetectionViewer>
                    <div class="d-flex flex-row">
                      <v-btn
                        style="width: 150px"
                        class="float-right my-3"
                        color="charcoal"
                        dark
                      >
                        Re-launch analysis
                      </v-btn>
                    </div>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-row>
        </v-container>
      </v-card>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import DetectionController from "@/api/artemis/detection.controller";
import { DetectionResult } from "@/api/interface/ApiArtemis.interface";
import DetectionViewer from "@/components/artemis/tiles/DetectionViewer.vue";

export default Vue.extend({
  name: "DetectionExplorer",

  components: {
    DetectionViewer
  },

  data: () => ({
    pendingOperations: [] as DetectionResult[],
    successOperations: [] as DetectionResult[],
    failedOperations: [] as DetectionResult[],

    getOperationErrors: "",

    loadingPending: false
  }),

  methods: {
    getPendingOperations() {
      DetectionController.getPendingDetections()
        .then((res: DetectionResult[]) => {
          this.pendingOperations = res;
        })
        .catch(err => {
          console.error("Failed to retrieve pending operations.", err);
          this.getOperationErrors = `Failed to retrieve pending operations : ${err}`;
        })
        .finally(() => {
          this.loadingPending = false;
        });
    },

    getSuccessfulOperations() {
      DetectionController.getSuccessfulDetections()
        .then((res: DetectionResult[]) => {
          this.successOperations = res;
        })
        .catch(err => {
          console.error("Failed to retrieve successful operations.", err);
          this.getOperationErrors = `Failed to retrieve successful operations : ${err}`;
        })
        .finally(() => {
          this.loadingPending = false;
        });
    },

    getFailedOperations() {
      DetectionController.getFailedDetections()
        .then((res: DetectionResult[]) => {
          this.failedOperations = res;
        })
        .catch(err => {
          console.error("Failed to retrieve failed operations.", err);
          this.getOperationErrors = `Failed to retrieve failed operations : ${err}`;
        })
        .finally(() => {
          this.loadingPending = false;
        });
    },

    stopDetection(detection: DetectionResult) {
      this.displayErrorDetection = false;
      DetectionController.cancelDetection(
        detection.application,
        detection.language
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

    reload() {
      this.getOperationErrors = "";
      this.getPendingOperations();
      this.getSuccessfulOperations();
      this.getPendingOperations();
    }
  },

  mounted() {
    this.reload();
  }
});
</script>
