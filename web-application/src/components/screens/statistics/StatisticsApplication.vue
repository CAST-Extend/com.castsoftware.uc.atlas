<template>
  <v-container fluid>
    <v-row class="ml-8 my-6">
      <h2 class="text-h2 mx-4">
        Generating report for application {{ value }}
      </h2>
      <v-spacer></v-spacer>
      <v-btn
        class="ma-2"
        :loading="loading"
        :disabled="loading"
        color="secondary"
        v-on:click="launchGenerate"
      >
        Generate
        <v-icon right dark>
          mdi-chart-box
        </v-icon>
      </v-btn>

      <v-btn
        :disabled="!generated"
        color="blue-grey"
        class="ma-2 white--text"
        @click="loader = 'loading3'"
      >
        Download
        <v-icon right dark>
          mdi-archive-arrow-down
        </v-icon>
      </v-btn>
    </v-row>
    <v-row
      min-width="80%"
      class="d-flex flex-column text-center mx-auto my-10"
      fill-height
      v-if="loading"
    >
      <v-progress-circular
        class="mx-auto"
        :size="70"
        color="primary"
        indeterminate
      ></v-progress-circular>
      <p class="my-5">
        Loading report for application ...<br />This can take a while on large
        application
      </p>
    </v-row>
    <v-row fluid ma-0 pa-0 fill-height v-if="!loading" class="px-6">
      <v-col cols="6">
        <v-row>
          <StatisticTile
            v-for="n in leftStats"
            :key="n.title"
            :title="n.title"
            :description="n.description"
            :results="n.result"
          ></StatisticTile>
        </v-row>
      </v-col>
      <v-col cols="6">
        <v-row>
          <StatisticTile
            v-for="m in rightStats"
            :key="m.title"
            :title="m.title"
            :description="m.description"
            :results="m.result"
          ></StatisticTile>
        </v-row>
      </v-col>
    </v-row>
    <v-row fill-height v-if="!loading" class="hidden-md-and-up">
      <v-col ma-0 pa-2 cols="12">
        <v-row>
          <StatisticTile
            v-for="n in statisticsList"
            :key="n.title"
            :title="n.title"
            :description="n.description"
            :results="n.result"
          ></StatisticTile>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-if="errorState != null">
      <ErrorDialog :title="errorState.title" :text="errorState.text">
      </ErrorDialog>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { ApplicationRecord } from "@/api/applications/application.controller";
import {
  StatisticResult,
  StatisticsController
} from "@/api/demeter/statistics.controller";
import ErrorDialog from "@/components/error/ErrorDialog.vue";
import StatisticTile from "@/components/screens/statistics/tiles/StatisticTile.vue";

export default Vue.extend({
  name: "StatisticsApplication",
  props: ["value"],

  components: {
    ErrorDialog,
    StatisticTile
  },

  data: () => ({
    generated: false,
    loading: false as boolean,
    numberOfApplication: 0 as number,
    applicationList: [] as ApplicationRecord[],
    statisticsList: [] as StatisticResult[],
    leftStats: [] as StatisticResult[],
    rightStats: [] as StatisticResult[],
    errorState: null as unknown
  }),

  methods: {
    /**
     * Get the results for a specific application
     */
    getReportResult() {
      this.loading = true;
      console.log(`Loading statistics for application with name ${this.value}`);

      StatisticsController.getStatisticResults("Configuration_1", this.value)
        .then((res: StatisticResult[]) => {
          this.loading = false;
          console.log(
            "Statistics were loaded for application with name : " + this.value
          );
          this.statisticsList = res;

          console.log(`${res.length} statistics were loaded.`);

          const pivotPoint: number = Math.floor(res.length / 2);
          this.leftStats = res.splice(0, pivotPoint);
          this.rightStats = res;

          this.generated = true;
        })
        .catch(err => {
          this.loading = false;
          this.errorState = { title: "Neo4j error", description: err };
          console.error("Error trying to retrieve statistics", err);
        });
    },

    launchGenerate: function() {
      this.getReportResult();
    }
  }
});
</script>
