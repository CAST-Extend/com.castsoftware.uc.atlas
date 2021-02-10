<template>
  <v-card class="pa-2">
    <v-row class="my-6 d-flex flex-column">
      <h3 class="text-h4 ml-8">Discover and apply tags on {{ application }}</h3>
      <p class="ml-8 py-6 pr-10 text-body-1">
        The discovery section is here to help you putting tags on interst points
        in your application. It matches some predefined patterns, to give you
        quick ideas of what can be done in the application.<br />
        You can enrich this configuration manually, and create custom generics
        tags in the <i>Tag creator studio</i>.
        <br />
        For more informations on tags and documents, please refer to the
        official <a href="#">CAST Imaging documentation</a>. <br /><br />
        To excecute a tag, you can navigate to the "use case tree" on the left
        column, expand the different use cases, and select the items you wan to
        execute. The selected items, that will be exeucted, appear on the right
        panel. <br />
        If you want more information about a recommendation, you can click on
        it, to display more details and see the description associated with the
        tag.<br /><br />
        NB: A recommendation displayed in blue means this recommendation will
        have a good effect on the application you currently selected.
      </p>
    </v-row>

    <v-card class="mx-4" min-width="90%" fluid>
      <v-toolbar color="charcoal" dark flat>
        <v-toolbar-title>Applicable tags</v-toolbar-title>
      </v-toolbar>

      <v-sheet class="pa-4 persianGrey">
        <v-text-field
          v-model="search"
          label="Search for Recommendations"
          dark
          flat
          solo-inverted
          hide-details
          clearable
          clear-icon="mdi-close-circle-outline"
        ></v-text-field>
      </v-sheet>

      <v-row no-gutters>
        <v-col max-width="400px">
          <v-card-text
            class="d-flex justify-center"
            v-if="!usecases || usecases.length == 0"
          >
            <v-progress-circular
              class="mx-auto my-8"
              :size="50"
              color="primary"
              indeterminate
            ></v-progress-circular>
          </v-card-text>
          <v-card-text
            class="d-flex justify-center"
            v-if="!application || application.length == 0"
          >
            <v-btn color="info" @click="refreshtree()">Load tags</v-btn>
          </v-card-text>

          <v-card-text v-if="usecases && usecases.length != 0">
            <v-treeview
              v-model="tree"
              :items="usecases"
              :search="search"
              selected-color="indigo"
              open-on-click
              selectable
              return-object
              expand-icon="mdi-chevron-down"
              on-icon="mdi-bookmark"
              off-icon="mdi-bookmark-outline"
              indeterminate-icon="mdi-bookmark-minus"
            >
              <template slot="label" slot-scope="{ item }">
                <p v-if="item.children">{{ item.name }}</p>
                <a
                  v-if="!item.children && item.numMatch != 0"
                  v-on:click="openDescription(item)"
                  >{{ item.name }}</a
                >
                <a
                  v-if="!item.children && item.numMatch == 0"
                  class="text--secondary"
                  v-on:click="openDescription(item)"
                  >{{ item.name }}</a
                >
              </template>
            </v-treeview>
          </v-card-text>
        </v-col>

        <v-divider vertical></v-divider>

        <v-col>
          <v-card-text>
            <h5 class="text-h5">Focused tag</h5>
            <h6 v-if="focusedTag == null" class="text-subtitle-1">
              No tag selected
            </h6>
            <span v-if="focusedTag != null">
              <h6 class="text-subtitle-1 text-decoration-underline">Name:</h6>
              <h6 class="text-body-1">{{ focusedTag.name }}</h6>
              <h6 class="text-subtitle-1 text-decoration-underline">
                Description:
              </h6>
              <h6 class="text-body-1">{{ focusedTag.description }}</h6>
              <h6 class="text-subtitle-1 text-decoration-underline">
                Number of objects concerned:
              </h6>
              <h6 class="text-body-1">{{ focusedTag.numMatch }}</h6>
              <h6 class="text-subtitle-1 text-decoration-underline">
                Categories:
              </h6>
              <v-row>
                <v-chip
                  v-for="b in splitCategories(focusedTag.categories)"
                  v-bind:key="b"
                  class="ma-2"
                  color="primary"
                  >{{ b }}</v-chip
                >
              </v-row>
            </span>
          </v-card-text>
        </v-col>

        <v-divider vertical></v-divider>

        <v-col>
          <v-card-text>
            <div
              v-if="tree.length === 0"
              key="title"
              class="title font-weight-light grey--text pa-4 text-center"
            >
              Select the tags you want to apply
            </div>

            <v-scroll-x-transition group hide-on-leave>
              <v-chip
                v-for="(selection, i) in tree"
                :key="i"
                color="grey"
                dark
                small
                class="ma-1"
              >
                <v-icon left small>
                  mdi-label
                </v-icon>
                {{ selection.name }}
              </v-chip>
            </v-scroll-x-transition>
          </v-card-text>
        </v-col>
      </v-row>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn text @click="tree = []">
          Reset
        </v-btn>

        <v-spacer></v-spacer>
        <i class="px-4" v-if="onGoingQueries.length > 0">
          Executing {{ onGoingQueries.length }}
          {{ onGoingQueries.length == 1 ? "query" : "queries" }}</i
        >
        <v-btn
          class="white--text"
          color="green darken-1"
          :loading="loadingQueries"
          depressed
          @click="executeSelectedTags()"
        >
          Execute {{ tree.length }}
          <v-icon right>
            mdi-animation-play
          </v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { ApplicationRecord } from "@/api/applications/application.controller";
import {
  UseCaseController,
  UseCaseResult
} from "@/api/demeter/useCase.controller";
import { TagController, TagResult } from "@/api/demeter/tag.controller";

export default Vue.extend({
  name: "TagViewer",

  components: {},

  computed: {
    getApplicationName() {
      return this.$store.state.applicationName;
    }
  },

  data: () => ({
    application: "" as string,

    tree: [] as (UseCaseResult | TagResult)[],
    usecases: [] as (UseCaseResult | TagResult)[],
    singleSelect: false,
    selected: [],
    onGoingQueries: [] as number[],

    applicationName: "No application selected" as string,
    numberOfApplication: 0 as number,
    applicationList: [] as ApplicationRecord[],
    tagResultList: [] as TagResult[],
    errorState: null as unknown,
    search: "",
    focusedTag: null as TagResult | null,

    // Loadings
    loadingApplication: true as boolean,
    loading: true as boolean,
    loadingQueries: false as boolean,

    openDescription(item: TagResult) {
      console.log("focus on : ", item);
      this.focusedTag = item;
    },

    splitCategories(cat: string): string[] {
      return cat.split(":");
    }
  }),

  mounted() {
    this.application = this.$store.state.applicationName;
    if (this.application && this.application.length != 0) {
      this.getTreeview();
    }
  },

  methods: {
    getTreeview() {
      this.loading = true;
      UseCaseController.getUseCaseAndTagsAsTree(this.application)
        .then(useCases => {
          this.loading = false;
          this.usecases = useCases;
        })
        .catch(err => {
          console.error("An error occurred while retrieving tags.", err);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    getTagResults() {
      this.loading = true;
      TagController.getTagResults("Configuration_1", this.application)
        .then((res: TagResult[]) => {
          this.tagResultList = res.sort(this.sortByNumMAtch);

          this.loading = false;
          console.log(res);
          console.log(
            `${res.length} tags were loaded for application ${this.application}`
          );
        })
        .catch(err => {
          console.error("An error occurred while retrieving tags.", err);
        });
    },

    refreshtree() {
      this.getTagResults();
      this.getTreeview();
    },

    checkOnGoing(idTag: number) {
      return this.onGoingQueries.indexOf(idTag) != -1;
    },

    async executeSelectedTags() {
      this.loadingQueries = true;

      // Get selection, and filter tags
      const toExecute: TagResult[] = this.tree.filter(x => {
        return x && (x as TagResult).type !== undefined;
      }) as TagResult[];

      console.log(
        `About to execute ${toExecute.length} tags on the application.`
      );

      for (const x in toExecute) {
        await this.executeTag(toExecute[x].id);
      }

      this.loadingQueries = false;
    },

    executeTag(idTag: number) {
      this.onGoingQueries.push(idTag);
      TagController.executeTag(this.application, idTag)
        .then((res: TagResult) => {
          console.log(res);
        })
        .catch(err => {
          console.error("Failed to execute the Tag request.", err);
        })
        .finally(() => {
          const index = this.onGoingQueries.indexOf(idTag);
          if (index > -1) {
            this.onGoingQueries.splice(index, 1);
          }
        });
    },

    convertBadgeToHTML(badgeValue: string): string {
      let categorieBadges = "";
      badgeValue.split(":").forEach(x => {
        categorieBadges += `<v-chip class="ma-2" color="primary">${x}</v-chip>`;
      });
      return categorieBadges;
    },

    sortByNumMAtch(a: TagResult, b: TagResult) {
      return b.numMatch - a.numMatch;
    }
  },

  watch: {
    getApplicationName(newApp) {
      this.application = newApp;
      if (this.application && this.application.length != 0) {
        this.getTreeview();
      }
    }
  }
});
</script>
