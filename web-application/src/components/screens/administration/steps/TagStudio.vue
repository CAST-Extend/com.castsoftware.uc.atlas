<template>
  <v-container class="ml-15">
    <!-- Introduction Section -->
    <v-row class="d-flex flex-column px-4">
      <h2 class="text-h4 my-6">
        Tag creator studio
      </h2>
      <p class="text-body-1">
        In this creator studio you'll be able to create your own Demeter
        recommendations ,in order to enrich your configuration, and display more
        informations on CAST Imaging System.<br />
        <br />
        For more informations on tags and documents, please refer to the
        official <a href="#">CAST Imaging documentation</a>.
        <br />
      </p>
    </v-row>

    <!-- Tag assistant -->
    <v-row v-if="showAssistant" transition="scroll-y-transition">
      <v-card class="mx-14" width="100%">
        <v-card-title>
          Tag creator assistant
        </v-card-title>
        <v-card-text>
          <v-container>
            <!-- Tag template title list -->
            <v-row>
              <v-col cols="3">
                <v-list dense>
                  <v-subheader>Models</v-subheader>
                  <v-list-item-group
                    v-model="selectedTagAssist"
                    color="primary"
                  >
                    <v-list-item v-for="(item, i) in tagAssistsItems" :key="i">
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="item.title"
                        ></v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-col>
              <!-- Tag template description -->
              <v-col cols="9">
                <v-textarea
                  class="pa-2"
                  height="200px"
                  label="Template"
                  :value="tagAssistsItems[selectedTagAssist].template"
                  outlined
                ></v-textarea>
                <v-row
                  class="px-4"
                  v-if="tagAssistsItems[selectedTagAssist].explanation"
                >
                  <p>How this request works :</p>
                  <i>{{ tagAssistsItems[selectedTagAssist].explanation }} </i>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-row>

    <!-- Creation assistant section -->
    <v-row>
      <v-col>
        <!-- Use case selection -->
        <v-card class="mx-auto">
          <v-card-text>
            <p class="display-1 text--primary">
              Use case
            </p>
            <div class="text--primary">
              Select a use case related to the recommendation you want to
              create.<br />The tag will be created under the selected use case.
              <br />
              <h4 class="my-3" v-if="activeItems && activeItems.length > 0">
                The tag will be created under the use case :
                {{ activeItems[0].name }}
              </h4>
            </div>
          </v-card-text>

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

          <v-card-text v-if="usecases && usecases.length != 0">
            <v-treeview
              v-model="tree"
              :active.sync="activeItems"
              selection-type="independent"
              :multiple-active="false"
              :items="usecases"
              selected-color="indigo"
              return-object
              activatable
              item-key="name"
            >
            </v-treeview>
          </v-card-text>

          <v-card-actions>
            <v-btn text color="indigo accent-4">
              Add a new use case
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Tag / Document assistant  -->
      <v-col>
        <v-card class="mx-auto">
          <v-card-text>
            <p class="display-1 text--primary">
              Recommendation
            </p>
            <div class="text--primary">
              Select the type of the recommendation to create
            </div>

            <v-select :items="items" v-model="recoType" label="Type"></v-select>

            <!-- Forms -->
            <!-- Tag Form -->
            <v-form v-if="recoType == 'Tag'" ref="form" lazy-validation>
              <v-text-field
                outlined
                v-model="tag.tagName"
                counter="25"
                :rules="[v => !!v || 'Tag name is required']"
                label="Tag to apply"
                required
              ></v-text-field>
              <v-textarea
                outlined
                name="associatedDescription"
                v-model="tag.description"
                label="Associated description"
                placeholder="Type here the descirption assoicated to your tag..."
              ></v-textarea>
              <v-textarea
                outlined
                name="associatedRequest"
                v-model="tag.associatedRequest"
                label="Associated Request"
                :rules="[v => !!v || 'Associated request is required']"
                placeholder="Type here your neo4j Cypher request..."
                @change="validRequest = false"
              ></v-textarea>
              <v-btn
                class="ma-2 float"
                color="info"
                @click="showAssistant = showAssistant ? false : true"
              >
                Open assitant
              </v-btn>
              <v-checkbox
                v-model="tag.activation"
                label="Set tag as active"
              ></v-checkbox>
            </v-form>

            <!-- Request validity -->
            <v-row
              class="pa-5"
              v-if="validityError && validityError.length != 0"
            >
              <p class="red--text">
                {{ validityError }}
              </p>
            </v-row>

            <!-- Creation Error -->
            <v-row
              class="pa-5"
              v-if="creationError && creationError.length != 0"
            >
              <v-alert
                :value="creationError.length != 0"
                color="pink"
                dark
                border="top"
                type="error"
                transition="scale-transition"
              >
                {{ creationError }}
              </v-alert>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-btn
              class="ma-2"
              :loading="loadingValidity"
              :disabled="loadingValidity"
              color="success"
              @click="checkValidity()"
            >
              Test validity
              <template v-slot:loader>
                <span>Loading...</span>
              </template>
            </v-btn>
            <v-btn
              class="ma-2"
              :loading="loadingCreation"
              :disabled="loadingCreation || !testPassed"
              color="info"
              @click="loader = 'loading4'"
            >
              Create recommendation
              <template v-slot:loader>
                <span class="custom-loader">
                  <v-icon light>mdi-cached</v-icon>
                </span>
              </template>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Tag, TagController } from "@/api/demeter/tag.controller";
import {
  UseCaseController,
  UseCaseResult
} from "@/api/demeter/useCase.controller";
import { Vue } from "vue-property-decorator";

export default Vue.extend({
  name: "TagStudio",

  created() {
    this.loadUseCase();
  },

  data: () => ({
    // Use case Tree
    usecases: [] as UseCaseResult[],
    tree: [],
    activeItems: [],

    // Assistant
    showAssistant: false,
    selectedTagAssist: 0,
    tagAssistsItems: [
      {
        title: "Group by Type",
        template:
          "MATCH (n:Object:%%CONTEXT_LABEL%%) WHERE n.Type CONTAINS 'JPA'  %%SET_TAG(n)%% %%RETURN_AS_NODES(n)%%",
        explanation:
          "The request will match all the objects where the type contains the string 'JPA'. By doing such a request, we'll apply a demeter tag to all the JPA objects, and identify them. The type of objects can be displayed  "
      },
      {
        title: "Group by Name",
        template:
          "MATCH (n:Object:%%CONTEXT_LABEL%%) WHERE n.FullName CONTAINS 'javax.persistence'  %%SET_TAG(n)%% %%RETURN_AS_NODES(n)%%",
        explanation: ""
      },
      {
        title: "Group by Relationship and Type ",
        template:
          "MATCH (n:Object:%%CONTEXT_LABEL%%) WHERE n.InternalType='SQLScriptProcedure' AND NOT (n)-[:USE]->(:Object { InternalType : 'SQLScriptTable'}) AND NOT (n)-[:CALL]->(:Object { InternalType : 'SQLScriptProcedure'}) %%SET_TAG(n)%% %%RETURN_AS_NODES(n)%%",
        explanation: ""
      }
    ],

    // Loaders
    loadingValidity: false,
    loadingCreation: false,

    selectedUseCaseId: -1 as number,
    testPassed: false,
    items: ["Tag", "Document"] as string[],

    // Form properties
    recoType: "Tag" as string,
    tag: {} as Tag,
    recoForm: {},

    // Validation
    validRequest: true,
    validityError: "",
    creationError: ""
  }),

  methods: {
    loadUseCase() {
      UseCaseController.getUseCaseTree()
        .then((useCases: UseCaseResult[]) => {
          this.usecases = useCases;
        })
        .catch(err => {
          console.error("Error trying to retrieve use cases tree:", err);
        });
    },

    updateSelectedItem(val: number) {
      this.selectedUseCaseId = val;
    },

    /**
     * Push the recommendation to the actual configuration
     */
    createRecommendation() {
      this.loadingCreation = true;
    },

    /**
     * Check the validty of the request in the form
     */
    checkValidity() {
      if (
        !this.tag.associatedRequest ||
        this.tag.associatedRequest.length == 0
      ) {
        this.validRequest = false;
        this.validityError = "The request cannot be empty.";
        return;
      }

      if (!this.activeItems || this.activeItems.length < 0) {
        this.validRequest = false;
        this.validityError = "You must select a use case.";
        return;
      }

      this.loadingValidity = true;

      TagController.checkValidity(this.tag.associatedRequest)
        .then((valid: boolean) => {
          this.validRequest = valid;

          if (valid) {
            console.log("The request is valid");
          } else {
            this.validityError = "ERROR : The request is malformed.";
          }
        })
        .catch(err => {
          this.validRequest = false;
          console.warn("The request produced an error", err);
        })
        .finally(() => {
          this.loadingValidity = false;
        });
    },

    /**
     * Create a Tag
     */
    createTag() {
      this.loadingCreation = true;
      this.tag.categories = "custom";
      this.tag.parentUseCasId = this.selectedUseCaseId;

      TagController.createTag(this.tag)
        .then(() => {
          console.log("Tag successfuly created");
        })
        .catch(err => {
          console.error("The creation of the tag failed", err);
        })
        .finally(() => {
          this.loadingCreation = false;
        });
    },

    /**
     * Launch an alert
     */
    launchAlert(text: string) {
      this.creationError = text;
      setTimeout(() => {
        this.creationError = "";
      }, 5000);
    }
  }
});
</script>
