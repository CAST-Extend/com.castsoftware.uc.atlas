<template>
  <v-card width="100%">
    <v-card-title class="text-h4">
      Custom categories manager
      <v-spacer></v-spacer>
      <v-btn icon color="green" @click="initialize()">
        <v-icon>mdi-cached</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-subtitle class="text-subtitle-1 ml-2 mt-2"
      >Create Framework categories where your frameworks will be regrouped in
      Imaging, you can also from here add the Icon directlty in imaging.
      <br />
      You can get more informations on how to manage your category here :
      <a href="https://github.com/CAST-Extend/com.castsoftware.uc.atlas">
        https://github.com/CAST-Extend/com.castsoftware.uc.atlas
      </a>
    </v-card-subtitle>
    <v-card-text>
      <v-container>
        <v-data-table
          :headers="headers"
          :items="items"
          sort-by="calories"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Category manager</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="600px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    New Category
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="6">
                          <v-subheader>Name of the category:</v-subheader>
                        </v-col>
                        <v-col cols="6">
                          <v-text-field
                            v-model="editedItem.name"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="6">
                          <v-subheader>Icon URL:</v-subheader>
                        </v-col>
                        <v-col cols="6">
                          <v-text-field
                            v-model="editedItem.iconUrl"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                      Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="save">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="headline"
                    >Are you sure you want to delete this item?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete"
                      >Cancel</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                      >OK</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteItem(item)">
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">
              Reset
            </v-btn>
          </template>
        </v-data-table>
      </v-container>
    </v-card-text>
    <!-- Snack Bar information -->
    <v-snackbar v-model="snackbarInfo" :timeout="5000">
      {{ textSnackBar }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbarInfo = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { CategoryController } from "@/api/artemis/category.controller";
import { Category } from "@/api/interface/ApiCategory.interface";

export default Vue.extend({
  name: "CategoriesCreator",

  data: () => ({
    dialog: false,
    dialogDelete: false,

    // Snack bar
    snackbarInfo: false,
    textSnackBar: "",

    // Table
    headers: [
      {
        text: "Name of the category",
        align: "start",
        sortable: true,
        value: "name"
      },
      {
        text: "Icon URL",
        value: "iconURL"
      },
      { text: "Actions", value: "actions", sortable: false }
    ],

    items: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      iconUrl: ""
    } as Category,
    defaultItem: {
      name: "",
      iconUrl: ""
    } as Category
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    }
  },

  mounted() {
    this.initialize();
  },

  methods: {
    initialize() {
      CategoryController.getAllNode()
        .then((res: Category[]) => {
          this.items = res;
        })
        .catch(err => {
          console.log("Failed to retrieve the list of Category", err);
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
      CategoryController.deleteNode(this.editedItem)
        .then((res: boolean) => {
          this.textSnackBar = "Successfully deleted the category.";
          this.snackbarInfo = true;
          this.initialize();
        })
        .catch(err => {
          this.textSnackBar = `Failed to delete the Category. Error: ${err}`;
          this.snackbarInfo = true;
        });

      this.closeDelete();
    },

    close() {
      this.dialog = false;
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
        CategoryController.updateNode(this.editedItem)
          .then((res: Category) => {
            this.textSnackBar = "Successfully updated the category.";
            this.snackbarInfo = true;
            this.initialize();
          })
          .catch(err => {
            this.textSnackBar = `Failed to udpdate the Category. Error: ${err}`;
            this.snackbarInfo = true;
          });
      } else {
        CategoryController.addNode(this.editedItem)
          .then((res: Category) => {
            this.textSnackBar = "Successfully added the category.";
            this.snackbarInfo = true;
            this.initialize();
          })
          .catch(err => {
            this.textSnackBar = `Failed to add the Category. Error: ${err}`;
            this.snackbarInfo = true;
          });
      }
      this.close();
    }
  }
});
</script>
