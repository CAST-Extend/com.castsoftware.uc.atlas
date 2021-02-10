<template>
  <v-card class="mx-auto parent-card elevation-5">
    <div class="card-header elevation-10 rounded-lg">
      <v-container class="d-flex flex-column" fill-height>
        <span class="text-h5">{{ numTags }} tags to execute.</span>
        <span class="text-subtitle-2"
          >Apply tags on your application to quickly discover informations</span
        >
      </v-container>
    </div>

    <v-card-text style="min-height: 170px;">
      <template>
        <v-container class="d-flex flex-column" v-if="error" fill-height>
          <span class="text-body-1"
            >An error happened during the execution</span
          >
          <span class="text-subtitle-2">Reload the page to retry</span>
        </v-container>
        <v-progress-linear
          v-if="loading"
          indeterminate
          color="cyan"
        ></v-progress-linear>
        <v-simple-table dense v-if="!loading && tagResultList != 0">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  Name
                </th>
                <th class="text-left">
                  Number of match
                </th>
                <th class="text-left">
                  Categories
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in tagResultList" :key="item.name">
                <td>{{ item.name }}</td>
                <td>{{ item.numMatch }}</td>
                <td>{{ item.categories || "No category" }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </template>
    </v-card-text>
    <v-card-actions class="px-6">
      <v-btn text color="deep-purple accent-4">
        Go to discovery Dashboard for more Tags
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { TagController, TagResult } from "@/api/demeter/tag.controller";
import Vue from "vue";

export default Vue.component("TagCandidateTile", {
  props: ["value"],

  mounted() {
    this.getTagResults();
  },

  data: () => ({
    numItems: 0,
    loading: true,
    error: false,
    tagResultList: [] as TagResult[],
    numTags: 0,

    headers: [
      {
        text: "Name of the tag",
        align: "start",
        sortable: false,
        value: "name"
      },
      { text: "Categories", value: "categories" },
      { text: "Matches", value: "numMatch" }
    ]
  }),

  methods: {
    sortByNumMAtch(a: TagResult, b: TagResult) {
      return b.numMatch - a.numMatch;
    },

    // Get Tag results
    getTagResults() {
      this.loading = true;
      TagController.getTagResults("Configuration_1", this.value)
        .then((res: TagResult[]) => {
          // Get the full length
          this.numTags = res.length;
          res = res.filter(x => x.numMatch != 0);
          const sliceIt: number = res.length < 3 ? res.length : 3;

          // Get the first 3 tags ordered by match
          this.tagResultList = res.sort(this.sortByNumMAtch).splice(0, sliceIt);
          this.loading = false;
          console.log(
            `${res.length} tags were loaded for application ${this.value}.`
          );
        })
        .catch(err => {
          console.error("An error occurred while retrieving tags.", err);
          this.loading = false;
          this.error = false;
        });
    }
  },

  watch: {
    value: function() {
      this.getTagResults();
    }
  }
});
</script>

<style>
.parent-card {
  position: relative;
  padding-top: 60px;
  margin-top: 60px;
}

.children-card {
  width: 300px;
}

.card-header {
  position: absolute;
  top: -60px;
  left: 0;

  /* Colors Bg & Text */
  background-color: indigo;
  color: white;

  width: calc(100% - 40px);
  margin: 20px;
  padding: 5px;
  min-height: 80px;
}
</style>
