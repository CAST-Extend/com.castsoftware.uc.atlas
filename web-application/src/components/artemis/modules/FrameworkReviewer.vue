<template>
  <v-container>
    <v-card>
      <v-card-title
        ><h3 class="text-h4 black--text mb-4 my-3">
          Review the frameworks discovered 
        </h3>
        <v-spacer></v-spacer>
          <v-btn icon large color="green" class="px-4" @click="refresh()">
            <v-icon>mdi-cached</v-icon>
          </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row class="d-flex flex-column px-2 ml-4">
          <p class=" text-body-1">
            Review the different frameworks detected.
          </p>
          <h4 class="mb-2">Legend :</h4>
          <p>
            <span class="px-3">
              <v-icon color="green">
                mdi-check-circle
              </v-icon>
              Detected as a Framework
            </span>
            <span class="px-3">
              <v-icon color="orange">
                mdi-check-circle
              </v-icon>
              Detected as a Framework but needs a validation
            </span>
            <span class="px-3">
              <v-icon color="red">
                mdi-checkbox-blank-circle
              </v-icon>
              Detected as not a Framework
            </span>
          </p>
          <p>Filters :</p>
          <p>
            <v-checkbox
              v-model="showOnlyToValidate"
              value="0"
              label="Filter frameworks to validate"
              type="checkbox"
              @change="refresh()"
              required
            ></v-checkbox>
          </p>
        </v-row>
        <v-row class="px-3">
          <v-card min-height="600px" min-width="100%">
            <v-card-text>
              <v-container>
                <!-- Search Bar -->
                <v-row>
                  <v-toolbar dark color="charcoal" class="mb-1 mb-5">
                    <v-text-field
                      v-model="search"
                      :loading="loadingSearch"
                      @change="searchFrameworks(search)"
                      clearable
                      flat
                      solo-inverted
                      hide-details
                      prepend-inner-icon="mdi-magnify"
                      label="Search"
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
                        <v-btn
                          large
                          depressed
                          color="persianGrey"
                          :value="false"
                        >
                          <v-icon>mdi-arrow-up</v-icon>
                        </v-btn>
                        <v-btn
                          large
                          depressed
                          color="persianGrey"
                          :value="true"
                        >
                          <v-icon>mdi-arrow-down</v-icon>
                        </v-btn>
                      </v-btn-toggle>
                    </template>
                  </v-toolbar>
                </v-row>

                <!-- Display and pick -->
                <v-row>
                  <!-- Search Column  -->
                  <v-col md="4">
                    <v-card min-width="100%">
                      <v-card-title class="pa-3">
                        Frameworks Detected</v-card-title
                      >
                      <v-card-text>
                        <v-container fluid>
                          <v-data-iterator
                            :items="items"
                            :items-per-page.sync="itemsPerPage"
                            :page.sync="page"
                            :search="search"
                            :sort-by="sortBy.toLowerCase()"
                            :sort-desc="sortDesc"
                            :loading="loadingTable"
                            hide-default-footer
                          >
                            <!-- Frameworks displayed on the left -->
                            <template v-slot:default="props">
                              <v-row>
                                <v-col
                                  v-for="(item, i) in props.items"
                                  :key="i"
                                  cols="12"
                                >
                                  <v-hover v-slot="{ hover }">
                                    <v-card
                                      :elevation="
                                        hover || i == currentIndex ? 8 : 2
                                      "
                                      class="frameworkListItem"
                                      @click="setFrameworkFocus(item, i)"
                                    >
                                      <v-card-title
                                        class="subheading font-weight-bold py-2"
                                      >
                                        {{ item.name }}
                                        <v-spacer></v-spacer>
                                        <v-icon
                                          color="green"
                                          v-if="
                                            item.type == 'Framework' &&
                                              item.description != ''
                                          "
                                        >
                                          mdi-check-circle
                                        </v-icon>
                                        <v-icon
                                          color="orange"
                                          v-if="
                                            item.type == 'Framework' &&
                                              item.description == ''
                                          "
                                        >
                                          mdi-check-circle
                                        </v-icon>
                                        <v-icon
                                          color="red"
                                          v-if="item.type != 'Framework'"
                                        >
                                          mdi-checkbox-blank-circle
                                        </v-icon>
                                      </v-card-title>
                                      <v-card-subtitle
                                        class="text-subtitle-1 text--black"
                                      >
                                        Internal type: {{ item.internalType }}
                                      </v-card-subtitle>
                                    </v-card>
                                  </v-hover>
                                </v-col>
                              </v-row>
                            </template>

                            <template v-slot:footer>
                              <v-row
                                class="mt-2"
                                align="center"
                                justify="center"
                              >
                                <span class="grey--text">Items per page</span>
                                <v-menu offset-y>
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                      dark
                                      text
                                      color="primary"
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
                                      v-for="(number,
                                      index) in itemsPerPageArray"
                                      :key="index"
                                      @click="updateItemsPerPage(number)"
                                    >
                                      <v-list-item-title>{{
                                        number
                                      }}</v-list-item-title>
                                    </v-list-item>
                                  </v-list>
                                </v-menu>

                                <v-spacer></v-spacer>

                                <span
                                  class="mr-4
            grey--text"
                                >
                                  Page {{ page }} of
                                  {{ numberOfPages() }}
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
                  </v-col>
                  <!-- Display Column  -->

                  <v-col md="8">
                    <v-card
                      min-width="100%"
                      min-height="100%"
                      class="pa-3"
                      id="frameworkEditorZone"
                    >
                      <span
                        v-if="editFramework == null"
                        id="selectMessage"
                        class="ma-auto text-subtitle-1"
                        >Please select a framework in the list to start
                        editing</span
                      >
                      <v-card-title>
                        Edit the framework
                        <span v-if="editFramework != null">
                          : <strong>{{ editFramework.name }}</strong></span
                        >
                        <v-spacer></v-spacer>
                        <v-btn
                          v-if="editFramework != null"
                          class="ma-1"
                          color="grey"
                          @click="undoModification()"
                          plain
                        >
                          Undo modifications
                        </v-btn>

                        <v-btn
                          v-if="editFramework != null"
                          class="ma-1"
                          color="error"
                          plain
                          @click="deleteFramework()"
                        >
                          Delete
                        </v-btn>
                      </v-card-title>
                      <v-card-text v-if="editFramework != null">
                        <v-container>
                          <v-row class="py-1">
                            <v-col cols="4">
                              <v-subheader class="text-h6">
                                Framework type :
                              </v-subheader>
                            </v-col>

                            <v-col cols="8">
                              <v-select
                                v-model="editFramework.type"
                                :items="frameworkTypes"
                                item-text="name"
                                item-value="value"
                                label="Select type"
                                hint="Type of the object ( Framework or not Framework )"
                                persistent-hint
                                single-line
                              ></v-select>
                            </v-col>
                          </v-row>

                          <v-row class="py-1">
                            <v-col cols="4">
                              <v-subheader class="text-h6">
                                Category :
                              </v-subheader>
                            </v-col>

                            <v-col cols="8">
                              <v-combobox
                                v-model="editFramework.category"
                                :items="framewokCategories"
                                item-text="name"
                                item-value="name"
                                label="Select a category"
                                :return-object="false"
                              ></v-combobox>
                            </v-col>
                          </v-row>
                          <v-row class="py-1">
                            <v-col cols="4">
                              <v-subheader class="text-h6">
                                Internal Type :
                              </v-subheader>
                            </v-col>

                            <v-col cols="8">
                              <v-combobox
                                v-model="editFramework.internalType"
                                :items="internalTypes"
                                label="Select a internal type"
                              ></v-combobox>
                            </v-col>
                          </v-row>
                          <v-row class="py-1 pb-5">
                            <v-col cols="4">
                              <v-subheader class="text-h6">
                                Location :
                              </v-subheader>
                            </v-col>

                            <v-col cols="8">
                              <v-text-field
                                v-model="editFramework.location"
                                counter="25"
                                hint="Location of the framework ( website, repository ...)"
                                label="Location"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row class="px-3">
                            <v-textarea
                              v-model="editFramework.description"
                              outlined
                              clearable
                              clear-icon="mdi-close-circle"
                              label="Description of the framework"
                              :value="editFramework.description"
                            ></v-textarea>
                          </v-row>
                        </v-container>
                      </v-card-text>
                      <v-card-actions v-if="editFramework != null">
                        <v-spacer></v-spacer>
                        <v-btn
                          class="ma-1"
                          color="green"
                          plain
                          :disabled="editFramework == focusedFramework"
                          :loading="updatingFramework"
                          @click="updateFramework(editFramework)"
                        >
                          Update the Framework
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-row>
      </v-card-text>
    </v-card>

    <v-snackbar v-model="displayUpdateSuccess" :timeout="2000">
      Framework {{ frameworkUpdateSnackBar }} was updated successfully

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar v-model="displayUpdateFailure" :timeout="2000">
      Something wrong happened during the update of
      {{ frameworkUpdateSnackBar }}.

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { Framework } from "@/api/interface/ApiArtemis.interface";
import { FrameworkController } from "@/api/artemis/framework.controller";
import Vue from "vue";
import { CategoryController } from "@/api/artemis/category.controller";
import { Category } from "@/api/interface/ApiCategory.interface";

export default Vue.component("FrameworkReviewer", {
  data: () => ({
    itemsPerPageArray: [8, 12, 50],
    search: "",
    filter: {},
    sortDesc: false,
    page: 1,
    itemsPerPage: 8,
    sortBy: "name",
    keys: [
      "Name",
      "Description",
      "Type discovered",
      "Category",
      "Internal type",
      "Location",
      "Discovery date",
      "Percentage of detection"
    ],
    items: [] as Framework[],
    numberItems: 0,

    // Check Box
    showOnlyToValidate: false,

    currentIndex: 0 as number,
    focusedFramework: null as Framework,
    editFramework: null as Framework,

    // Editing choice
    frameworkTypes: [
      {
        name: "Framework",
        value: "Framework"
      },
      {
        name: "Not a Framework",
        value: "NotFramework"
      }
    ],

    framewokCategories: [] as Category[],
    internalTypes: [],
    loadingTable: false,

    // Update
    updatingFramework: false,
    displayUpdateSuccess: false,
    displayUpdateFailure: false,
    frameworkUpdateSnackBar: "",

    // Searching
    loadingSearch: false
  }),

  computed: {
    filteredKeys() {
      return this.keys.filter(key => key !== "Name");
    }
  },

  methods: {
    getListCategories() {
      CategoryController.getAllNode()
        .then((res: Category[]) => {
          this.framewokCategories = res;
        })
        .catch(err => {
          console.log("Failed to retrieve the list of categories", err);
        });
    },

    setFrameworkFocus(item: Framework, itemIndex: number) {
      this.currentIndex = itemIndex;
      this.focusedFramework = this.items[this.currentIndex];
      this.editFramework = Object.assign({}, item);
    },

    getFocusedFramework(): Framework {
      return this.items[this.currentIndex];
    },

    undoModification() {
      this.editFramework = this.focusedFramework;
    },

    deleteFramework() {
      console.log("Delete the framework : ", this.focusedFramework);
    },

    // Get number of frameworks
    getNumberFrameworks() {
      FrameworkController.getTotalFramework()
        .then((res: number) => {
          this.numberItems = res;
        })
        .catch(err => {
          console.error("Failed to retrieve the list of frameworks.", err);
        });
    },

    getInternalTypes() {
      FrameworkController.getInternalTypes()
        .then((res: string[]) => {
          this.internalTypes = res;
        })
        .catch(err => {
          console.error("Failed to retrieve the list of internal types", err);
        });
    },

    updateFramework(item: any) {
      const oldName: string = this.focusedFramework.name;
      const oldType: string = this.focusedFramework.internalType;

      this.frameworkUpdateSnackBar = oldName;
      console.log("New Framework : ", item);

      this.updatingFramework = true;
      FrameworkController.updateFrameworks(oldName, oldType, item)
        .then((res: boolean) => {
          this.displayUpdateSuccess = true;
          this.refreshFramework();
        })
        .catch(err => {
          console.error("Failed to update the framework.", err);
          this.displayUpdateFailure = true;
        })
        .finally(() => {
          this.updatingFramework = false;
        });
    },

    getBatchFramework() {
      const startIndex = this.page * this.itemsPerPage;
      const stopIndex = startIndex + this.itemsPerPage;
      this.getNumberFrameworks();

      this.loadingTable = true;

      FrameworkController.getFrameworkBatch(startIndex, stopIndex)
        .then((res: Framework[]) => {
          this.items = res;
          if (this.currentIndex) {
            this.setFrameworkFocus(this.currentIndex);
          }
        })
        .catch(err => {
          console.error("Failed to retrieve the list of frameworks.", err);
        })
        .finally(() => {
          this.loadingTable = false;
        });
    },

    getToValidateFramework() {
      this.loadingTable = true;
      FrameworkController.getToValidateFrameworks()
        .then((res: Framework[]) => {
          this.items = res;
          this.currentIndex = 0;
          this.numberItems = res.length;
        })
        .catch(err => {
          console.error("Failed to retrieve the list of frameworks.", err);
        })
        .finally(() => {
          this.loadingTable = false;
        });
    },

    refreshFramework() {
      if (this.showOnlyToValidate) {
        this.getToValidateFramework();
      } else {
        this.getBatchFramework();
      }
    },

    searchFrameworks(toSearch: string) {
      if (!toSearch || toSearch.length == 0) {
        this.refreshFramework();
        return;
      }

      this.loadintTable = true;
      this.loadingSearch = true;

      FrameworkController.searchFramework(toSearch)
        .then((res: Framework[]) => {
          this.items = res;
          this.numberItems = res.length;
          this.currentIndex = 0;
        })
        .catch(err => {
          console.error("Failed to search for frameworks.", err);
        })
        .finally(() => {
          this.loadingTable = false;
          this.loadingSearch = false;
        });
    },

    nextPage() {
      this.currentIndex = 0;
      if (!this.showOnlyToValidate) this.refreshFramework();
      if (this.page + 1 <= this.numberOfPages()) this.page += 1;
    },

    formerPage() {
      this.currentIndex = 0;
      if (!this.showOnlyToValidate) this.refreshFramework();
      if (this.page - 1 >= 1) this.page -= 1;
    },

    updateItemsPerPage(number) {
      this.itemsPerPage = number;
    },

    numberOfPages(): number {
      return Math.ceil(this.numberItems / this.itemsPerPage);
    },

    refresh() {
      this.getNumberFrameworks();
      this.refreshFramework();
    }
  },

  mounted() {
    this.refresh();
    this.getInternalTypes();
    this.getListCategories();
  }
});
</script>

<style>
.frameworkListItem {
  cursor: pointer;
}

.frameworkListItem .v-card__subtitle {
  padding-bottom: 4px !important;
}

#frameworkEditorZone {
  position: relative;
}

#frameworkEditorZone #selectMessage {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translateX(-50%);
}
</style>
