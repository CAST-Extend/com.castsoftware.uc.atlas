<!-- Login modal -->
<template>
  <v-app class="main-application">
    <v-container class="login-container mx-auto" v-if="showLogin" fill-height>
      <v-card class="mx-auto" ref="form">
        <v-card-text>
          <v-card-title class="mt-3 mb-8">
            <h2>
              Log in to Neo4j database
            </h2>
          </v-card-title>
          <v-text-field
            ref="neo4jUser"
            v-model="credentials.user"
            label="Database user"
            placeholder="Neo4j user"
            required
          ></v-text-field>
          <v-text-field
            v-model="credentials.password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'"
            name="input-10-1"
            label="Database password"
            @click:append="show1 = !show1"
          ></v-text-field>
          <v-text-field
            v-model="uri"
            name="input-10-1"
            label="Database bolt URI"
            @click:append="show1 = !show1"
          ></v-text-field>

          <!-- Information on connection -->
          <div
            v-if="failedLogin"
            class="red darken-2 text-center pa-2"
            width="100%"
          >
            <span class="white--text"
              >Wrong credentials / URI. Contact your CAST Imaging administrator
              for more informations.</span
            >
          </div>
          <v-divider></v-divider>

          <div>
            <p class="mt-2 text-subtitle-1">Options :</p>
            <v-switch
              v-model="switchIternalUse"
              label="Internal use ( CAST User )"
            ></v-switch>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="save">
            Login
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import { Configuration, Credentials } from "@/Configuration";
import { Neo4JAccessLayer } from "./api/Neo4jAccessLayer";
import { ServerInfo } from "neo4j-driver";

export default Vue.extend({
  name: "Login",

  data: () => ({
    failedLogin: false,
    showLogin: true,
    show1: false,
    uri: Configuration.getProperties().neo4jUri,
    credentials: {} as Credentials,

    switchIternalUse: false
  }),

  methods: {
    // Check, save and redirect to the Main dashboard
    save() {
      // Save new URI
      const properties = Configuration.getProperties();
      properties.neo4jUri = this.uri;
      Configuration.saveProperties(properties);

      // Connect to Neo4j
      Neo4JAccessLayer.connectWithCredentials(this.credentials);
      const neo4jAl: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();
      console.log("new props ", properties);

      neo4jAl
        .testConnection()
        .then((res: ServerInfo) => {
          // Successful connection , redirect to main
          console.log("Connection successful.", res);
          this.$router.replace("/atlas/main");
          window.location.reload();
        })
        .catch(err => {
          // Cannot connect to the Neo4j instance
          console.error("Cannot connect to Neo4j", err);
          this.failedLogin = true;
        });
    }
  }
});
</script>

<style>
.login-container {
  display: block;
  width: 100%;

  /* Positionning */
  position: absolute;
  top: 0;
  left: 0;

  background-color: rgba(0, 0, 0, 0.103);
  min-width: 100vw;
  min-height: 100vh;
}
</style>
