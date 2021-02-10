import Vue from "vue";
import Vuex from "vuex";

import Application from "@/Application.vue";
import Login from "./Login.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import store from "./store";

import { Neo4JAccessLayer } from "./api/Neo4jAccessLayer";
import { Component } from "vue-router/types/router";
import { DaemonController } from "./api/daemon/daemon.controler";

Vue.config.productionTip = false;
Vue.use(Vuex);

console.log("Launching Olympus");

// Test Neo4J Connection
// If connected, render the app view, otherwise ask for a login
Neo4JAccessLayer.connect();
const neo4jAl: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();

// Declare application
let el: Component;

neo4jAl
  .testConnection()
  .then(() => {
    // Successful connection
    router.replace("/atlas/main");
    el = Application;
  })
  .catch(err => {
    // Cannot connect to the Neo4j instance
    console.warn("Connection to Neo4j failed.", err);
    router.replace("/atlas/login");
    el = Login;
  })
  .finally(() => {
    new Vue({
      router: router,
      vuetify,
      store,
      render: h => h(el)
    }).$mount("#app");
  });

// Launch the Tag Daemon
const daemon: DaemonController = DaemonController.getInstance();
daemon.run();
