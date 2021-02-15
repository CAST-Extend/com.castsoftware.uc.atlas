<template>
  <v-card class="ma-3 mb-3">
    <v-card-text>
      <v-container fluid>
        <v-data-iterator
          :items="items"
          :items-per-page.sync="itemsPerPage"
          :page="page"
          :search="search"
          :sort-by="sortBy.toLowerCase()"
          :sort-desc="sortDesc"
          hide-default-footer
        >
          <template v-slot:header>
            <v-toolbar dark color="charcoal" class="mb-1">
              <v-text-field
                v-model="search"
                clearable
                flat
                solo-inverted
                hide-details
                prepend-inner-icon="mdi-magnify"
                label="Search for actions"
              ></v-text-field>
              <template v-if="$vuetify.breakpoint.mdAndUp">
                <v-spacer></v-spacer>
                <v-select
                  v-model="sortBy"
                  flat
                  solo-inverted
                  hide-details
                  :items="keys"
                  prepend-inner-icon="mdi-magnify"
                  label="Sort by"
                ></v-select>
                <v-spacer></v-spacer>
                <v-btn-toggle v-model="sortDesc" mandatory>
                  <v-btn large depressed color="persianGrey" :value="false">
                    <v-icon>mdi-arrow-up</v-icon>
                  </v-btn>
                  <v-btn large depressed color="persianGrey" :value="true">
                    <v-icon>mdi-arrow-down</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </template>
            </v-toolbar>
          </template>

          <template v-slot:default="props">
            <v-row>
              <v-col
                v-for="(item, i) in props.items"
                :key="i"
                cols="12"
                sm="6"
                md="6"
                lg="4"
                xl="3"
              >
                <v-card min-height="200px">
                  <v-card-title class="subheading font-weight-bold">
                    <v-row style="height: 60px">
                      <v-col cols="8">{{ item.title }}</v-col>
                      <v-col cols="4"
                        ><v-chip class="px-2">
                          {{ item.category }}
                        </v-chip></v-col
                      >
                    </v-row>
                  </v-card-title>
                  <v-card-subtitle> </v-card-subtitle>

                  <v-card-text style="height: 70px">
                    {{ item.description }}
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-card-actions>
                      <v-btn
                        class="ma-2"
                        color="persianGrey"
                        dark
                        @click="executeTag(item)"
                      >
                        Launch grouping
                      </v-btn>
                    </v-card-actions>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </template>

          <template v-slot:footer>
            <v-row class="mt-2" align="center" justify="center">
              <span class="grey--text">Items per page</span>
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    dark
                    text
                    color="persianGrey"
                    class="ml-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ itemsPerPage }}
                    <v-icon>mdi-chevron-down</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(number, index) in itemsPerPageArray"
                    :key="index"
                    @click="updateItemsPerPage(number)"
                  >
                    <v-list-item-title>{{ number }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>

              <v-spacer></v-spacer>

              <span
                class="mr-4
            grey--text"
              >
                Page {{ page }} of {{ numberOfPages }}
              </span>
              <v-btn
                fab
                dark
                color="persianGrey"
                class="mr-1"
                @click="formerPage"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn
                fab
                dark
                color="persianGrey"
                class="ml-1"
                @click="nextPage"
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </v-row>
          </template>
        </v-data-iterator>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {
  GroupAction,
  GroupActionController
} from "@/api/demeter/groupAction.controller";
import Vue from "vue";

export default Vue.extend({
  name: "ModernizationStep",

  computed: {
    getApplicationName() {
      return this.$store.state.applicationName;
    },

    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
    filteredKeys() {
      return this.keys.filter(key => key !== "Name");
    }
  },

  methods: {
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
    },

    executeTag(item: GroupAction) {
      GroupActionController.executeAction(item);
    }
  },

  mounted() {
    this.application = this.$store.state.applicationName;
    GroupActionController.getModernizationActions(this.application)
      .then((res: GroupAction[]) => {
        this.items = res;
      })
      .catch(err => {
        console.error("Failed to retrieve the grouping actions.", err);
      });
  },

  data: () => ({
    application: "",

    itemsPerPageArray: [8, 12, 40],
    search: "",
    filter: {},
    sortDesc: false,
    page: 1,
    itemsPerPage: 8,
    sortBy: "name",
    keys: ["title", "category", "description"],
    items: [{}]
  }),

  watch: {
    getApplicationName(newApp) {
      this.application = newApp;
    }
  }
});
</script>
