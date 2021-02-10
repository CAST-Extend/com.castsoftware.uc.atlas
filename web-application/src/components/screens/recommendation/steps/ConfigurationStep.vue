<template>
  <v-container>
    <v-card>
      <v-card-text>
        <v-row class="mx-2 mt-2 d-flex flex-column">
          <h5 class="text-h5 black--text">Statistics on the application</h5>
          <p>
            Quickly discover if the configuration of the application's analysis
            is correct with some statistiscs on it
          </p>
          <h3>Color Schema :</h3>
          <p>
            The statistical tiles below change color according to the score they
            measure. A green tile is a sign that the statistics have a "high
            percentage" of compliance.<br />
            They they follow the following color schema :
          </p>
          <div class="color-ruler mb-6">
            <div class="round">0</div>
            <div class="round">33</div>
            <div class="round">66</div>
            <div class="round">100</div>
          </div>
          <p>
            <i
              >Disclaimer : It can happens that even with the perfect
              configuration, the statistics display bad scores. Further
              investigation is necessary to understand where these scores come
              from.<br />
              That can done with the action tiles, below this section, to
              investigate direclty in CAST Imaging.</i
            >
          </p>
        </v-row>

        <v-divider></v-divider>

        <v-row class="my-5" style="min-height: 300px">
          <v-progress-circular
            v-if="loadingStatistics"
            :size="60"
            :width="7"
            color="persianGrey"
            class="ma-auto"
            indeterminate
          ></v-progress-circular>

          <PercentageTile
            v-for="(item, i) in statistics"
            v-bind:key="i"
            :title="item.title"
            :description="item.description"
            :percentage="item.percentage"
            :inverted="item.inverseResult"
          ></PercentageTile>
        </v-row>
      </v-card-text>
    </v-card>
    <v-divider></v-divider>
    <v-card class="mx-3">
      <v-row class="mt-5">
        <ActionTileViewer> </ActionTileViewer>
      </v-row>
      <v-row class="mb-5"></v-row>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import {
  StatisticPercentageResult,
  StatisticsController
} from "@/api/demeter/statistics.controller";
import Vue from "vue";
import PercentageTile from "@/components/screens/recommendation/tiles/PercentageTile.vue";
import ActionTileViewer from "@/components/screens/recommendation/components/ActionTileViewer.vue";

export default Vue.extend({
  name: "ConfigurationStep",

  components: {
    PercentageTile,
    ActionTileViewer
  },

  computed: {
    getApplicationName() {
      return this.$store.state.applicationName;
    }
  },

  mounted() {
    this.application = this.$store.state.applicationName;
    this.getConfigurationStatistics();
  },

  data: () => ({
    application: "",
    statistics: [] as StatisticPercentageResult[],
    loadingStatistics: false
  }),

  methods: {
    getConfigurationStatistics() {
      this.loadingStatistics = true;
      this.statistics = [];
      StatisticsController.getConfigurationStatistics(this.application)
        .then((res: StatisticPercentageResult[]) => {
          this.statistics = res;
        })
        .catch(err => {
          console.error(
            "An error occured while retrieving configuration statistics...",
            err
          );
        })
        .finally(() => {
          this.loadingStatistics = false;
        });
    }
  },

  watch: {
    getApplicationName(newApp) {
      this.application = newApp;
      this.getConfigurationStatistics();
    }
  }
});
</script>

<style>
.color-ruler {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  border-radius: 29px;
  border: 2px solid #545454;
  border-right: 1px solid #545454;
  border-left: 1px ins #545454;

  height: 30px;
  width: 300px;
  background: rgb(231, 111, 81);
  background: linear-gradient(
    90deg,
    rgba(231, 111, 81, 1) 0%,
    rgba(244, 162, 97, 1) 33%,
    rgba(233, 196, 106, 1) 66%,
    rgba(42, 157, 143, 1) 100%
  );
}

.color-ruler .round {
  content: "";
  display: table-cell;
  vertical-align: middle;

  transform: translateY(-2px);
  line-height: 28px;
  font-size: 12px;

  border-radius: 20px;
  /* border: 2px solid #545454; */
  text-align: center;
  vertical-align: middle;

  height: 29px;
  width: 29px;
  background-color: white;
}
</style>
