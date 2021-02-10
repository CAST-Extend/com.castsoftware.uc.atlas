<template>
  <v-card width="100%">
    <v-card-title class="text-h4">
      Pythia : Framework repository
      <v-spacer></v-spacer>
      <v-btn icon color="green" @click="refresh()">
        <v-icon>mdi-cached</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-subtitle class="text-subtitle-1"
      >You can configure here the use of pytha that you want to make.<br />
      Pythia is an online repository that will gather the frameworks of several
      instances of Artemis.</v-card-subtitle
    >
    <v-card-text>
      <!-- Configuration pythia -->
      <v-divider></v-divider>
      <h2 class="my-3 mr-2">
        Configuration of Pythia
      </h2>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="pythiaURI"
              hint="URI of the Pythia server ( ex : http://192.9.1.0:3000 )"
              label="Pythia URI"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              v-model="pythiaToken"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              name="input-10-1"
              label="Pythia token"
              hint="Authentication token of Pythia"
              counter
              @click:append="show1 = !show1"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-btn
              class="mt-3"
              color="charcoal"
              dark
              :loading="connectionLoading"
              v-on:click="updateConnection()"
            >
              Connect to Pythia
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <p v-if="connectionPythia">
            <v-icon color="green" class="mr-2"
              >mdi-checkbox-marked-circle-outline</v-icon
            >Connection to Pythia successful !
          </p>
          <p v-if="errorConnectionPythia != ''">
            <v-icon color="red" class="mr-2"
              >mdi-checkbox-marked-circle-outline</v-icon
            >Failed to connect to Pythia : {{ errorConnectionPythia }}
          </p>
        </v-row>
      </v-container>
      <v-divider></v-divider>
      <!-- Push / pull  -->
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <h2 class="my-3 ">
              Last version pulled: <em>{{ lastUpdateLocal }}</em>
            </h2>
            <h2 class="my-3">
              Last version of Pythia: <em>{{ lastUpdatePythia }}</em>
            </h2>
          </v-col>
          <v-col cols="12" md="4" style="min-height: 100%"
            ><v-btn color="charcoal" dark class="my-4">
              <span v-if="isDatabaseEven()">Force pull</span>
              <span v-else>Pull {{ framewokToPull }} frameworks</span>
            </v-btn></v-col
          >
        </v-row>
        <v-row></v-row>
      </v-container>

      <!-- Even Case -->
      <div class="text-subtitle-1" v-if="isDatabaseEven()">
        <v-icon color="green" class="mr-2"
          >mdi-checkbox-marked-circle-outline</v-icon
        >
        It seems that this local database is up-to-date !
      </div>
      <!-- Not even case -->
      <div class="text-subtitle-1" v-else>
        <v-icon color="red" class="mr-2">mdi-exclamation-thick</v-icon>A new set
        of frameworks are avaible on Pythia ! <br />
        <em>{{ framewokToPull }} framework where added since the last pull</em>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import PythiaController from "@/api/pythia/pythia.controller";
import ConfigurationController from "@/api/configuration/configuration.controller";

export default Vue.extend({
  name: "PythiaParameters",

  data: () => ({
    lastUpdateLocal: "Never",
    lastUpdatePythia: "Unkown",

    lastLocalTimestamp: 0,
    lastRemoteTimstamp: 0,

    even: true as boolean,
    framewokToPull: 0,

    pythiaURI: "",
    pythiaToken: "",
    show1: false,

    placeHolderToken: "******-*******-*******-*****",

    connectionPythia: false,
    errorConnectionPythia: "",

    // Connect button
    connectionLoading: false
  }),

  methods: {
    isDatabaseEven() {
      return this.lastLocalTimestamp >= this.lastRemoteTimstamp;
    },

    getLastLocalUpdate() {
      PythiaController.getLocalLastUpdate()
        .then((res: number) => {
          this.lastLocalTimestamp = res;
          this.lastUpdateLocal = new Date(res).toDateString();
        })
        .catch(err => {
          console.log("Failed to retieve the last local update", err);
          this.lastUpdatePythia =
            "Unkown - Make sure you installed the latest version of Artemis ";
        });
    },

    getRemoteLastUpdate() {
      PythiaController.getRemoteLastUpdate()
        .then((res: number) => {
          this.lastRemoteTimstamp = res;
          this.lastUpdatePythia = new Date(res).toDateString();
        })
        .catch(err => {
          console.error("Failed to retieve the last local update", err);
          this.lastUpdatePythia =
            "Unkown - Please check the configuraiton of Pythia ";
        });
    },

    getNumPull() {
      PythiaController.getPullForecast()
        .then((res: number) => {
          this.framewokToPull = res;
        })
        .catch(err => {
          console.log("Failed to pull fremwork", err);
        });
    },

    getURIPythia() {
      ConfigurationController.getPythiaURL()
        .then((res: string) => {
          this.pythiaURI = res;
          if (res == "") {
            this.errorConnectionPythia =
              "No URI was detected in the configuration";
          } else {
            this.errorConnectionPythia = "";
          }
          console.log("Local URI ", res);
        })
        .catch(err => {
          console.error("Failed to retrieve the URI of Pythia", err);

          this.errorConnectionPythia = err;
        });
    },

    getTokenPythia() {
      ConfigurationController.getPythiaTokenPresence()
        .then((res: boolean) => {
          if (res == true) {
            this.pythiaToken = this.placeHolderToken;
          } else {
            this.pythiaToken = "";
          }
        })
        .catch(err => {
          console.error("Failed to retrieve the Tokean of Pythia", err);

          this.errorConnectionPythia = err;
        });
    },

    setTokenPythia() {
      ConfigurationController.setPythiaToken(this.pythiaToken)
        .then((res: boolean) => {
          this.pythiaToken = this.placeHolderToken;
          console.log("Token was successfully changed.");
          if (res == false) {
            this.errorConnectionPythia =
              "No Token was detected in the configuration";
          } else {
            this.errorConnectionPythia = "";
          }
        })
        .catch(err => {
          console.error("Failed to change the password of Pythia", err);

          this.errorConnectionPythia = err;
        });
    },

    async updateConnection() {
      this.connectionLoading = true;

      if (this.pythiaToken != this.placeHolderToken) {
        await new Promise<void>((resolve, reject) => {
          ConfigurationController.setPythiaToken(this.pythiaToken)
            .then((res: boolean) => {
              this.pythiaToken = this.placeHolderToken;
              console.log("Token was successfully changed.");
              if (res == false) {
                this.errorConnectionPythia =
                  "No Token was detected in the configuration";
              } else {
                this.errorConnectionPythia = "";
              }
              resolve();
            })
            .catch(err => {
              console.error("Failed to change the password of Pythia", err);
              this.errorConnectionPythia = err;
              reject();
            });
        });
      }

      await new Promise<void>((resolve, reject) => {
        ConfigurationController.setPythiaURL(this.pythiaURI)
          .then((res: string) => {
            console.log("Pythia URI was changed to ", res);
            resolve();
          })
          .catch(err => {
            console.error("Failed to change the URL of pythia. ", err);
            reject();
          });
      });

      this.refresh();
      this.connectionLoading = false;
    },

    refresh() {
      this.getLastLocalUpdate();
      this.getRemoteLastUpdate();
      this.getURIPythia();
      this.getTokenPythia();
      this.getNumPull();
    }
  },

  mounted() {
    this.refresh();
  }
});
</script>
