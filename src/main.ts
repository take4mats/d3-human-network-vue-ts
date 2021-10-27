import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import VueCompositionAPI from "@vue/composition-api";
import VueGtag from "vue-gtag";

Vue.config.productionTip = false;

Vue.use(VueCompositionAPI);

if (process.env.NODE_ENV === "production") {
  Vue.use(VueGtag, {
    config: { id: "G-0EBCZGWZWT" },
  });
}

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
