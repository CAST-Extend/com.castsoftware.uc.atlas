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
          <p class="d-flex flex-row ">
            <v-checkbox
              v-model="showOnly"
              value="ToValidate"
              label="Filter frameworks to validate"
              type="checkbox"
              @change="refresh()"
              required
            ></v-checkbox>
            <v-checkbox
              class="ml-5"
              v-model="showOnly"
              value="Duplicates"
              label="Filter duplicates frameworks"
              type="checkbox"
              @change="refresh()"
              required
            ></v-checkbox>
          </p>
        </v-row>
        <v-row>
          <v-data-table
            :headers="headers"
            :items="items"
            :items-per-page.sync="itemsPerPage"
            :page.sync="page"
            :search="search"
            :single-expand="true"
            show-expand
            :sort-by="sortBy.toLowerCase()"
            :sort-desc="sortDesc"
            :loading="loadingTable"
            hide-default-footer
            class="elevation-1"
            style="min-height: 300px; min-width: 100%"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>Detected Framework</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-text-field
                  v-model="toSearch"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                  @change="searchFrameworks"
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="750px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      dark
                      class="mb-2"
                      v-bind="attrs"
                      v-on="on"
                    >
                      New Item
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline"
                        >{{ formTitle }} {{ editedItem.name }}</span
                      >
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row class="py-1 pb-5">
                          <v-col cols="4">
                            <v-subheader class="text-h6">
                              Name:
                            </v-subheader>
                          </v-col>

                          <v-col cols="8">
                            <v-text-field
                              v-model="editedItem.name"
                              counter="25"
                              hint="Name of the framework ( will be used during the detection )"
                              label="Name"
                            ></v-text-field>
                          </v-col>
                        </v-row>

                        <v-row class="py-1">
                          <v-col cols="4">
                            <v-subheader class="text-h6">
                              Framework type:
                            </v-subheader>
                          </v-col>

                          <v-col cols="8">
                            <v-select
                              v-model="editedItem.type"
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
                              Category:
                            </v-subheader>
                          </v-col>

                          <v-col cols="8">
                            <v-combobox
                              v-model="editedItem.category"
                              :items="frameworkCategories"
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
                              Internal Types:
                            </v-subheader>
                          </v-col>

                          <v-col cols="8">
                            <v-autocomplete
                              v-model="editedItem.internalType"
                              :items="internalTypes"
                              label="Select the internal types"
                              outlined
                              chips
                              small-chips
                              multiple
                            ></v-autocomplete>
                          </v-col>
                        </v-row>
                        <v-row class="py-1 pb-5">
                          <v-col cols="4">
                            <v-subheader class="text-h6">
                              Location:
                            </v-subheader>
                          </v-col>

                          <v-col cols="8">
                            <v-text-field
                              v-model="editedItem.location"
                              counter="25"
                              hint="Location of the framework ( website, repository ...)"
                              label="Location"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row class="px-3">
                          <v-textarea
                            v-model="editedItem.description"
                            outlined
                            clearable
                            clear-icon="mdi-close-circle"
                            label="Description of the framework"
                            :value="editedItem.description"
                          ></v-textarea>
                        </v-row>
                        <v-row
                          class="red--darken--text"
                          v-if="editItemError && editItemError != ''"
                          >{{ editItemError }}</v-row
                        >
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="close">
                        Cancel
                      </v-btn>
                      <v-btn
                        class="ma-1"
                        color="green"
                        plain
                        :disabled="editedItem == focusedFramework"
                        :loading="editItemLoading"
                        @click="save"
                      >
                        Save the Framework
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDelete" max-width="500px">
                  <v-card>
                    <v-card-title class="headline"
                      ><v-container>
                        <v-row
                          >Are you sure you want to delete this
                          <strong>{{ editedItem.name }}</strong> item?</v-row
                        >
                        <v-row
                          class="red--darken--text"
                          v-if="editItemError && editItemError != ''"
                          >{{ editItemError }}</v-row
                        >
                      </v-container></v-card-title
                    >
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="closeDelete"
                        >Cancel</v-btn
                      >
                      <v-btn
                        v-if="editedItem != null"
                        class="ma-1"
                        color="error"
                        plain
                        @click="deleteFramework()"
                      >
                        Delete
                      </v-btn>
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.validation="{ item }">
              <v-icon
                color="green"
                v-if="item.type == 'Framework' && item.description != ''"
              >
                mdi-check-circle
              </v-icon>
              <v-icon
                color="orange"
                v-if="item.type == 'Framework' && item.description == ''"
              >
                mdi-check-circle
              </v-icon>
              <v-icon color="red" v-if="item.type != 'Framework'">
                mdi-checkbox-blank-circle
              </v-icon>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon small class="mr-2" @click="deleteItem(item)">
                mdi-delete
              </v-icon>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    @click="toggleFramework(item)"
                    small
                    v-bind="attrs"
                    v-on="on"
                  >
                    mdi-check-underline-circle-outline
                  </v-icon>
                </template>
                <span>Quickly toggle the validation</span>
              </v-tooltip>
            </template>
            <template v-slot:expanded-item="{ headers, item }">
              <td colspan="100%">
                <v-container>
                  <v-row class="my-4">More info about {{ item.name }}</v-row>
                  <v-row class="mb-4"
                    >Category:
                    <strong class="ml-3">{{ item.category }} </strong></v-row
                  >
                  <v-row class="mb-4"
                    >Found on:
                    <strong class="ml-3">{{ item.location }} </strong></v-row
                  >
                  <v-row class="mb-4"
                    >Description:
                    <strong class="ml-3">{{ item.description }} </strong></v-row
                  >
                  <v-row class="mb-4"
                    >This rules currently match the following obejct types:
                    <v-chip-group column>
                      <v-chip small v-for="tag in item.internalType" :key="tag">
                        {{ tag }}
                      </v-chip>
                    </v-chip-group></v-row
                  >
                </v-container>
              </td>
            </template>
            <template v-slot:footer>
              <v-row class="mt-2 pa-4" align="center" justify="center">
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
                  Page {{ page }} of
                  {{ numberOfPages() }}
                </span>
                <v-btn
                  fab
                  dark
                  color="persianGrey"
                  class="mr-1"
                  @click="formerPage()"
                >
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn
                  fab
                  dark
                  color="persianGrey"
                  class="ml-1"
                  @click="nextPage()"
                >
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </v-row>
            </template>
            <template v-slot:no-data>
              <v-btn color="primary" @click="refresh">
                Reset
              </v-btn>
            </template>
          </v-data-table>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>
        <v-icon class="mr-2" color="teal"> mdi-cogs </v-icon> Action on the
        configuration</v-card-title
      >
      <v-card-text>
        <v-container>
          <v-row class="mb-4">
            <v-col class="mt-1" cols="6">
              Automatically clean the configuration from duplicates nodes<br>The duplicates framework properties will be merged.
              <br>
              {{ autoCleanInfo }}
            </v-col>
            <v-col cols="6">
              <v-btn
                  class="ma-2"
                  :loading="loadingAutoClean"
                  :disabled="loadingAutoClean"
                  color="teal"
                  dark
                  @click="launchAutoClean"

                >
                  Auto cleaning
                </v-btn>
            </v-col>
          </v-row>
          <v-divider></v-divider>
        </v-container>
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
    page: 0,
    itemsPerPage: 14,
    sortBy: "name",

    headers: [
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Description", value: "description" },
      { text: "Category", value: "category" },
      { text: "Type discovered", value: "type" },
      { text: "Discovery date", value: "discoveryDate" },
      { text: "Validation", value: "validation", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
      { text: "", value: "data-table-expand" },
    ],

    toSearch: "",
    items: [] as Framework[],
    numberItems: 0,

    // Check Box
    showOnly: "",

    currentIndex: 0 as number,
    focusedFramework: null as Framework,

    // Editing choice
    frameworkTypes: [
      {
        name: "Framework",
        value: "Framework",
      },
      {
        name: "Not a Framework",
        value: "NotFramework",
      },
    ],

    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {
      name: "",
      description: "",
      type: "NotFramework",
      category: "External",
      internalType: [""],
      location: "",
    } as Framework,
    defaultItem: {
      name: "",
      description: "",
      type: "NotFramework",
      category: "External",
      internalType: [""],
      location: "",
    } as Framework,

    editItemError: "",
    editItemLoading: false,

    frameworkCategories: [] as Category[],
    internalTypes: [],
    loadingTable: false,

    // Update
    updatingFramework: false,
    displayUpdateSuccess: false,
    displayUpdateFailure: false,
    frameworkUpdateSnackBar: "",

    // Searching
    loadingSearch: false,

    // AutoClean
    loadingAutoClean: false,
    autoCleanInfo: "",
  }),

  computed: {
    filteredKeys() {
      return this.headers.filter((key) => key !== "Name");
    },
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },

  methods: {
    getListCategories() {
      CategoryController.getAllNode()
        .then((res: Category[]) => {
          this.frameworkCategories = res;
        })
        .catch((err) => {
          console.error("Failed to retrieve the list of categories", err);
        });
    },

    setFrameworkFocus(item: Framework, itemIndex: number) {
      this.currentIndex = itemIndex;
      this.focusedFramework = this.items[this.currentIndex];
      this.editedItem = Object.assign({}, item);
    },

    getFocusedFramework(): Framework {
      return this.items[this.currentIndex];
    },

    undoModification() {
      this.editedItem = this.focusedFramework;
    },

    deleteFramework() {
      this.editItemLoading = true;
      FrameworkController.deleteFramework(this.items[this.editedIndex].id)
        .then((val: boolean) => {
          if (val) {
            this.refreshFramework();
            this.closeDelete();
          }
          this.editItemError = "Failed to delete the framework";
        })
        .catch((err) => {
          this.editItemError = err;
        })
        .finally(() => {
          this.editItemLoading = false;
        });
    },

    toggleFramework(item: any) {
      this.editItemLoading = true;
      FrameworkController.toggleFramework(item.id)
        .then((val: boolean) => {
          if (val) {
            this.refreshFramework();
          }
        })
        .catch((err) => {
          console.error("Toggle framework failed", err);
          this.editItemError = err;
        });
    },

    // Get number of frameworks
    getNumberFrameworks() {
      FrameworkController.getTotalFramework()
        .then((res: number) => {
          this.numberItems = res;
        })
        .catch((err) => {
          console.error("Failed to retrieve the list of frameworks.", err);
        });
    },

    getInternalTypes() {
      FrameworkController.getInternalTypes()
        .then((res: string[]) => {
          this.internalTypes = res;
        })
        .catch((err) => {
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
        .catch((err) => {
          console.error("Failed to update the framework.", err);
          this.displayUpdateFailure = true;
        })
        .finally(() => {
          this.updatingFramework = false;
        });
    },

    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      console.log("Deletion not implemented");
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.editItemError = "";
      this.editItemLoading = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        // Update framework
        this.editItemLoading = true;
        FrameworkController.updateFrameworksById(this.editedItem)
          .then((val: boolean) => {
            if (val) this.close();
            this.editItemError = "Failed to update the framework";
          })
          .catch((err) => {
            console.error("Failed to update the framework", err);
            this.editItemError = err;
          })
          .finally(() => {
            this.editItemLoading = false;
          });

        Object.assign(this.items[this.editedIndex], this.editedItem);
      } else {
        // Create framework
        // Create framework
        FrameworkController.addFramework(this.editedItem)
          .then((val: boolean) => {
            if (val) this.close();
            this.editItemError = "Failed to add the framework";
          })
          .catch((err) => {
            console.error("Failed to add the framework", err);
            this.editItemError = err;
          })
          .finally(() => {
            this.editItemLoading = false;
          });

        this.items.push(this.editedItem);
      }
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
        .catch((err) => {
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
        .catch((err) => {
          console.error("Failed to retrieve the list of frameworks.", err);
        })
        .finally(() => {
          this.loadingTable = false;
        });
    },

    getDuplicatesFramework() {
      this.loadingTable = true;
      FrameworkController.getDuplicatesFrameworks()
        .then((res: Framework[]) => {
          this.items = res;
          this.currentIndex = 0;
          this.numberItems = res.length;
        })
        .catch((err) => {
          console.error("Failed to retrieve the list of frameworks.", err);
        })
        .finally(() => {
          this.loadingTable = false;
        });
    },

    refreshFramework() {
      if (this.showOnly == "ToValidate") {
        this.getToValidateFramework();
      } else if (this.showOnly == "Duplicates") {
        this.showOnlyToValidate = false;
        this.getDuplicatesFramework();
      } else {
        this.getBatchFramework();
      }
    },

    launchAutoClean() {
      this.loadingAutoClean = true;
      FrameworkController.launchAutoCleaning()
        .then((res: number) => {
          this.autoCleanInfo = `${res} groups were cleaned during the operation.`
        })
        .catch((err) => {
          console.error("Failed to search for frameworks.", err);
        })
        .finally(() => {
          this.loadingAutoClean =false;
        });
        
    },

    searchFrameworks() {
      if (!this.toSearch || this.toSearch.length == 0) {
        this.refreshFramework();
        return;
      }

      this.loadintTable = true;
      this.loadingSearch = true;

      FrameworkController.searchFramework(this.toSearch)
        .then((res: Framework[]) => {
          this.items = res;
          this.numberItems = res.length;
          this.currentIndex = 0;
        })
        .catch((err) => {
          console.error("Failed to search for frameworks.", err);
        })
        .finally(() => {
          this.loadingTable = false;
          this.loadingSearch = false;
        });
    },

    nextPage() {
      this.currentIndex = 0;
      if (this.page + 1 <= this.numberOfPages()) this.page += 1;
      this.refreshFramework();
    },

    formerPage() {
      this.currentIndex = 0;
      if (this.page - 1 >= 0) this.page -= 1;
      this.refreshFramework();
    },

    updateItemsPerPage(number) {
      this.itemsPerPage = number;
    },

    numberOfPages(): number {
      return Math.ceil(this.numberItems / this.itemsPerPage);
    },

    refresh() {
      this.page = 0;
      this.getInternalTypes();
      this.getNumberFrameworks();
      this.refreshFramework();
    },
  },

  mounted() {
    this.refresh();
    this.getInternalTypes();
    this.getListCategories();
  },
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
