<template>
  <v-card width="100%">
    <v-card-title class="text-h4">
      Custom Regex rules creator
      <v-spacer></v-spacer>
      <v-btn icon color="green" @click="refresh()">
        <v-icon>mdi-cached</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-subtitle class="text-subtitle-1 ml-2 mt-2"
      >Create in this section custom categories. The categories will match and
      regroup objects in your level wiews to make the investigation easier.
      <br />
      You can configure the groups with different Regexes, and frameworks names
      and category.
      <a href="https://github.com/CAST-Extend/com.castsoftware.uc.atlas">
        https://github.com/CAST-Extend/com.castsoftware.uc.atlas
      </a>
    </v-card-subtitle>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-container>
              <v-row class="mb-6">
                <v-btn
                  width="100%"
                  color="primary"
                  dark
                  large
                  @click="addRegexTemplate()"
                >
                  Append a new Regex rule
                  <v-icon dark right>
                    mdi-plus-box
                  </v-icon>
                </v-btn>
              </v-row>
              <v-row v-if="items.length == 0">
                <h4 class="text-h5">
                  No regex rules detected, start adding new rules
                </h4>
              </v-row>
              <v-row>
                <v-treeview
                  style="width: 100%"
                  v-model="tree"
                  :items="items"
                  activatable
                  return-object
                  open-on-click
                  item-key="id"
                >
                  <template v-slot:prepend="{ item, open }">
                    <v-icon large v-if="!item.file">
                      {{ open ? "mdi-folder-open" : "mdi-folder" }}
                    </v-icon>
                    <v-icon large v-else>
                      {{ files[item.file] }}
                    </v-icon>
                  </template>
                  <template slot="label" slot-scope="{ item }">
                    <v-container>
                      <v-row>
                        <v-col cols="8"
                          ><h4 class="text-h5 mx-2">{{ item.name }}</h4></v-col
                        >
                        <v-col cols="4" class="mt-3">
                          <v-icon
                            class="mr-3"
                            color="primary"
                            dark
                            @click="focusItem(item)"
                          >
                            mdi-eye
                          </v-icon>
                          <v-icon
                            color="red"
                            dark
                            @click="askForDeletion(item)"
                          >
                            mdi-trash-can-outline
                          </v-icon>
                        </v-col>
                      </v-row>
                      <v-row class="pl-6 mb-1">
                        <em>{{ item.regexes }}</em>
                      </v-row>
                      <v-row class="pl-5"
                        ><v-chip-group column>
                          <v-chip
                            v-for="tag in item.internalTypes"
                            :key="tag"
                            small
                          >
                            {{ tag }}
                          </v-chip>
                        </v-chip-group></v-row
                      >
                    </v-container>
                  </template>
                </v-treeview>
              </v-row>
            </v-container>
          </v-col>
          <v-col cols="12" md="6">
            <v-card min-height="400px">
              <v-card-title class="text-h4">
                <span v-if="!addMode">Review the Regex Rules</span>
                <span v-if="addMode">Add a Regex Rules</span>
                <span v-if="!editMode" class="pl-2 text-h6 text--red"
                  >(Read Only)</span
                >
                <span v-if="editMode" class="pl-2 text-h6">(Edit mode)</span>
                <v-spacer></v-spacer>
                <v-btn
                  outlined
                  :color="!editMode ? 'green' : 'red'"
                  @click="editMode = !editMode"
                >
                  Edit
                  <v-icon class="ml-2">mdi-lead-pencil</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text v-if="!isFocused()"
                >Select a Regex node to start</v-card-text
              >
              <v-card-text v-if="isFocused()">
                <v-container class="pl-2">
                  <v-row class="mx-1 mb-5"
                    ><h4 class="text-h6">Name of the Rule</h4></v-row
                  >
                  <v-row class="mx-1">
                    <v-text-field
                      v-model="focusedRegexNode.name"
                      label="Name"
                      solo
                      :readonly="!editMode"
                    ></v-text-field>
                  </v-row>
                  <v-row class="mx-1 mb-5"
                    ><h4 class="text-h6">Name of the framework</h4></v-row
                  >
                  <v-row class="mx-1">
                    <v-text-field
                      v-model="focusedRegexNode.framework"
                      label="Framework"
                      solo
                      :readonly="!editMode"
                    ></v-text-field>
                  </v-row>

                  <v-row class="mx-1 mb-5"
                    ><h4 class="text-h6">List of Regexes</h4></v-row
                  >
                  <v-row class="mb-1 ml-2"><h4>Add a new regex rule</h4></v-row>
                  <v-row>
                    <v-col cols="10"
                      ><v-text-field
                        v-model="currentRegexInput"
                        solo
                        label="Append outer"
                        :disabled="!editMode"
                      ></v-text-field
                    ></v-col>
                    <v-col class="d-flex flex-row" cols="2">
                      <v-btn
                        width="100%"
                        color="primary"
                        dark
                        large
                        @click="appendToRegexList(focusedRegexNode)"
                      >
                        ADD
                        <v-icon dark right>
                          mdi-plus-box
                        </v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row v-if="isFocused()" class="pl-3 d-flex flex-column ">
                    <v-text-field
                      v-for="(regex, i) in focusedRegexNode.regexes"
                      v-bind:key="i"
                      :value="regex"
                      solo
                      label="Append"
                      readonly
                      :disabled="!editMode"
                      append-outer-icon="mdi-close"
                      @click:append-outer="
                        removeFromList(focusedRegexNode, regex)
                      "
                    ></v-text-field>
                  </v-row>
                  <v-row class="mx-1 mb-5"
                    ><h4 class="text-h6">List of Internal types</h4></v-row
                  >
                  <v-row class="mx-1">
                    <v-autocomplete
                      v-model="focusedRegexNode.internalTypes"
                      :items="internalTypes"
                      label="Internal types"
                      :readonly="!editMode"
                      multiple
                      chips
                    ></v-autocomplete>
                  </v-row>
                  <v-row class="mx-1 mb-5"
                    ><h4 class="text-h6">Category</h4></v-row
                  >
                  <v-row class="mx-1">
                    <v-autocomplete
                      v-model="focusedRegexNode.category"
                      :items="categories"
                      item-text="name"
                      item-value="name"
                      :readonly="!editMode"
                      label="Category"
                      chips
                    ></v-autocomplete>
                  </v-row>
                  <v-divider class="my-5"></v-divider>
                  <v-row class="mx-1 mb-5"
                    ><h4 class="text-h6">Parent category</h4></v-row
                  >
                  <v-row class="mx-1">
                    <v-select
                      v-model="focusedRegexNode.parentId"
                      :items="parentIdList"
                      :readonly="!editMode"
                      item-text="name"
                      item-value="id"
                      label="Parent ID"
                    ></v-select>
                  </v-row>
                  <v-divider class="my-5"></v-divider>
                  <v-row>
                    <v-spacer></v-spacer>
                    <v-btn
                      class="mx-3"
                      color="primary"
                      :disabled="addMode"
                      @click="testRegexNode(focusedRegexNode)"
                    >
                      Test the Regex Rule
                    </v-btn>
                    <v-btn
                      v-if="addMode"
                      color="primary"
                      @click="addRegex(focusedRegexNode)"
                    >
                      Add the Regex Rule
                    </v-btn>
                    <v-btn
                      v-if="!addMode"
                      color="primary"
                      :disabled="!editMode"
                      @click="updateRegex(focusedRegexNode)"
                    >
                      Update the Regex Rule
                    </v-btn>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <!-- Export to cypher .file -->

        <v-row class="mx-1 my-4">
          <v-card width="100%">
            <v-card-title>
              Advanced options:
              <v-spacer></v-spacer>
              <v-btn
                class="mr-2"
                color="primary"
                @click="
                  expandOptions = expandOptions != 'export' ? 'export' : ''
                "
              >
                Export options
              </v-btn>
              <v-btn
                color="primary"
                @click="
                  expandOptions = expandOptions != 'generate' ? 'generate' : ''
                "
              >
                Generate
              </v-btn>
            </v-card-title>
            <!-- Export options  -->
            <v-expand-transition>
              <v-card-text
                v-show="expandOptions == 'export'"
                class="mx-auto secondary white--text"
              >
                <v-container>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-row>
                        <h3 class="text-h5 mt-3">
                          Export the rules to a cypher file
                        </h3>
                      </v-row>
                      <v-row>
                        <h3 class="my-3">Select the rules to export:</h3>
                        <v-treeview
                          color="white"
                          class="white--text"
                          selectable
                          v-model="treeExport"
                          :items="items"
                          selection-type="all"
                          return-object
                        ></v-treeview>
                      </v-row>
                      <v-row>
                        <v-spacer></v-spacer>
                        <v-btn @click="getArtifactTree()">
                          Get artifacts
                        </v-btn>
                      </v-row>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-card
                        style="background-color: #606060; min-height: 100%; color: #ffdc16"
                        class="ma-3 pa-4"
                      >
                        <p v-html="fullExportRequest"></p>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-expand-transition>
            <!-- Generate Options -->
            <v-expand-transition>
              <v-card-text
                v-show="expandOptions == 'generate'"
                class="mx-auto secondary white--text"
              >
                <v-container>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-row>
                        <h3 class="text-h5 mt-3">
                          Generate rules from the breakdown of the application
                        </h3>
                      </v-row>
                      <v-row class="mt-2 mb-4">
                        <h3 class="my-3">Select the rules to export:</h3>
                        <v-treeview
                          color="white"
                          class="white--text"
                          selectable
                          v-model="artifactTree"
                          :items="artifactItems"
                          selection-type="independent"
                          return-object
                        ></v-treeview>
                      </v-row>
                      <v-row>
                        <v-col cols="12" md="4">
                          <v-select
                            class="mx-2"
                            v-model="defaultApplication"
                            :items="applicationItems"
                            label="Applications"
                            @change="getArtifactTree()"
                            outlined
                            dark
                          ></v-select>
                        </v-col>

                        <v-col cols="12" md="4">
                          <v-select
                            class="mx-2"
                            v-model="defaultLanguage"
                            :items="languageItems"
                            label="Language"
                            @change="getArtifactTree()"
                            outlined
                            dark
                          ></v-select>
                        </v-col>

                        <v-col cols="12" md="4">
                          <v-btn large @click="createQuerySet()">
                            Generate the queries
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-card
                        style="background-color: #606060; min-height: 100%; color: #ffdc16"
                        class="ma-3 pa-4"
                      >
                        <p v-html="fullQuerySet"></p>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-expand-transition>
          </v-card>
        </v-row>
      </v-container>
    </v-card-text>

    <!-- Snack bar for test -->
    <v-snackbar v-model="snackbarTestResults" :timeout="10000">
      {{ testRegexResults }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="snackbarTestResults = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <!-- Modal to validate the suppresion of a rule -->
    <v-dialog v-model="dialogDeleteNode" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">
          Are you sure to delete this rule ?
        </v-card-title>
        <v-card-text>
          You're about to delete the rule {{ toDelete.name }}. <br />
          The rule currenlty affect : {{ dialogDeleteNodeNumAffected }} objects
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialogDeleteNode = false">
            Cancel
          </v-btn>
          <v-btn
            color="red darken-1"
            text
            @click="removeRegexNode(toDelete.id)"
            :loading="deletingNode"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Snack Bar information -->
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { ApiRegexNode } from "@/api/interface/ApiRegexNode.interface";
import { FrameworkController } from "@/api/artemis/framework.controller";
import { RegexNodeController } from "@/api/artemis/regexNode.controller";
import { CategoryController } from "@/api/artemis/category.controller";
import { ArtifactController } from "@/api/artemis/artifact.controller";
import { Category } from "@/api/interface/ApiCategory.interface";
import { Artifact } from "@/api/interface/ApiArtifact.interface";
import { ApplicationController } from "@/api/applications/application.controller";
import { ArtemisController } from "@/api/artemis/artemis.controller";

export default Vue.extend({
  name: "CustomsCreator",

  data: () => ({
    initiallyOpen: [],

    // Regegex node
    focusedRegexNode: {} as ApiRegexNode,
    defaultRegexNode: {
      name: "",
      regexes: [],
      internalTypes: [],
      framework: "",
      category: "",
      parentId: -1
    } as ApiRegexNode,

    currentRegexInput: "",
    editMode: false,
    addMode: false,

    // Options
    expandOptions: "",

    // Snackbars
    testRegexResults: "",
    snackbarTestResults: false,

    snackbarInfo: false,
    textSnackBar: "",

    internalTypes: [],
    categories: [],

    tree: [],
    treeExport: [] as ApiRegexNode[],
    fullExportRequest: "",
    fullQuerySet: "",

    // Artifacts
    artifactItems: [],
    artifactTree: [],
    applicationItems: [] as string[],
    languageItems: [] as string[],
    defaultApplication: "",
    defaultLanguage: "",

    parentIdList: [],

    items: [] as ApiRegexNode[],

    // Deletion
    dialogDeleteNode: false,
    dialogDeleteNodeNumAffected: "",
    toDelete: {} as ApiRegexNode,
    deletingNode: false
  }),

  methods: {
    focusItem(regexNode: ApiRegexNode) {
      this.testRegexResults = "";
      this.addMode = false;
      this.focusedRegexNode = Object.assign({}, regexNode);
    },

    initFocusView() {
      this.focusedRegexNode = {};
    },

    isFocused() {
      return !(
        Object.keys(this.focusedRegexNode).length == 0 &&
        this.focusedRegexNode.constructor === Object
      );
    },

    addRegexTemplate() {
      this.focusedRegexNode = Object.assign({}, this.defaultRegexNode);
      this.addMode = true;
      this.editMode = true;
    },

    /**
     * Add a regex Rule
     */
    addRegex(item: ApiRegexNode) {
      RegexNodeController.addRegexNode(item)
        .then((res: ApiRegexNode) => {
          this.focusedRegexNode = Object.assign({}, this.defaultRegexNode);
          this.addMode = false;
          this.editMode = false;
          this.displayInfoSnackbar("Successfully added the rule.");
          this.refresh();
        })
        .catch(err => {
          console.error("Failed to add the rule", err);
          this.displayInfoSnackbar(`Failed to add the rule. Error: ${err}`);
        });
    },

    displayInfoSnackbar(toDisplay: string) {
      this.textSnackBar = toDisplay;
      this.snackbarInfo = true;
    },

    /**
     *  Update the regex
     */
    updateRegex(item: ApiRegexNode) {
      RegexNodeController.updateRegexNode(item)
        .then((res: ApiRegexNode) => {
          this.addMode = false;
          this.editMode = false;
          this.displayInfoSnackbar("Successfully updated the rule.");
          this.refresh();
        })
        .catch(err => {
          console.error("Failed to update the rule");
          this.displayInfoSnackbar(`Failed to update the rule. Error: ${err}`);
        });
    },

    /**
     * Add the regex string to the regex rule
     */
    appendToRegexList(regexNode: ApiRegexNode) {
      if (this.currentRegexInput != "") {
        regexNode.regexes.push(this.currentRegexInput);
      }
      this.currentRegexInput == "";
      this.focusedRegexNode = regexNode;
    },

    removeRegexNode(item: ApiRegexNode) {
      this.deletingNode = true;
      RegexNodeController.deleteRegexNode(this.toDelete.id)
        .then((res: boolean) => {
          if (res) {
            this.displayInfoSnackbar("Successfully deleted the rule.");
            this.refresh();
          } else {
            // Do something with the err
            console.error("Failed to delete the node.", item);
            this.displayInfoSnackbar("Failed to update the rule. Bad Request.");
          }
        })
        .catch(err => {
          console.error("Failed to delete the node.", item);
          this.displayInfoSnackbar(`Failed to delete the rule. Error: ${err}`);
        })
        .finally(() => {
          this.dialogDeleteNode = false;
          this.deletingNode = false;
        });
    },

    /**
     *  Ask for a confirmation before the deletion
     */
    askForDeletion(item: ApiRegexNode) {
      // open the modal
      this.dialogDeleteNode = true;
      this.toDelete = item;
      RegexNodeController.testRegex(this.toDelete.id)
        .then((res: number) => {
          this.dialogDeleteNodeNumAffected = res;
        })
        .catch(err => {
          this.dialogDeleteNodeNumAffected = err;
        });
    },

    testRegexNode(item: ApiRegexNode) {
      RegexNodeController.testRegex(item.id)
        .then((res: number) => {
          this.testRegexResults = `${res} objects matched this rule`;
          this.snackbarTestResults = true;
        })
        .catch(err => {
          this.testRegexResults = err;
        });
    },

    removeFromList(regexNode: ApiRegexNode, item: string) {
      const index = regexNode.regexes.indexOf(item);
      if (index != -1) {
        regexNode.regexes.splice(index, 1);
      }
      this.focusedRegexNode = regexNode;
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

    getCategories() {
      CategoryController.getAllNode()
        .then((res: Category[]) => {
          this.categories = res;
        })
        .catch(err => {
          console.log("Failed to retrieve the list of categories");
        });
    },

    getAllNodesAsTree() {
      RegexNodeController.getAllNodesAsTree()
        .then((res: ApiRegexNode[]) => {
          if (res[0].name.length == 0) {
            this.items = res[0].children;
          } else {
            this.items = res;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },

    createQuerySet() {
      ArtifactController.buildQuerySet(
        this.artifactTree,
        this.defaultApplication,
        this.defaultLanguage
      )
        .then((res: string) => {
          this.fullQuerySet = res;
        })
        .catch(err => {
          this.fullQuerySet = err;
        });
    },

    getNodeList() {
      RegexNodeController.getAllNode()
        .then((res: ApiRegexNode[]) => {
          this.parentIdList = [];
          for (let i = 0; i < res.length; i++) {
            const toPush = { id: res[i].id, name: res[i].name };
            if (this.parentIdList.indexOf(toPush) === -1) {
              this.parentIdList.push(toPush);
            }
          }
          this.parentIdList.push({ id: -1, name: "No parent" });
        })
        .catch(err => {
          console.error(err);
        });
    },

    getApplicationAndLanguages() {
      ApplicationController.getListApplications()
        .then((res: string[]) => {
          console.log("Application list", res);
          this.applicationItems = res;
          this.defaultApplication = res[0];
        })
        .catch(err => {
          console.error("Failed to get the list of the application");
        });

      ArtemisController.getSupportedLanguages()
        .then((res: string[]) => {
          this.languageItems = res;
          this.defaultLanguage = res[0];
        })
        .catch(err => {
          console.error("Failed to retrieve languages.", err);
        });
    },

    getArtifactTree() {
      console.log("Get Artifact Tree data");
      // Get the tree
      ArtifactController.getArtifactAsTree(
        this.defaultApplication,
        this.defaultLanguage
      )
        .then((res: Artifact[]) => {
          console.log("Get Artifact Tree", res);
          this.artifactItems = res;
        })
        .catch(err => {
          console.error(
            `Error trying to retrieve the breakdown of ${this.defaultApplication}`,
            err
          );
        });
      // Get the list of application
    },

    // Build the list this.treeExport
    async getRequests(tree: ApiRegexNode[]) {
      if (tree.length == 0) return;
      let fullResults = "";
      try {
        for (const item in tree) {
          fullResults +=
            "<span style='color: #66B245'>// " +
            tree[item].name +
            "</span><br />";
          fullResults +=
            (await RegexNodeController.getRegexRequest(tree[item].id)) +
            ";<br /><br />";

          if (tree[item].children) {
            fullResults += await this.getRequests(tree[item].id);
          }
        }
      } catch (err) {
        console.error("Failed to get the request", err);
      }

      return fullResults;
    },

    async buildRequestTree() {
      this.fullExportRequest = await this.getRequests(this.treeExport);
    },

    refresh() {
      this.getInternalTypes();
      this.getCategories();
      this.getNodeList();
      this.getAllNodesAsTree();
      this.initFocusView();
      this.getApplicationAndLanguages();
    }
  },

  mounted() {
    this.refresh();
    this.getArtifactTree();
  }
});
</script>
