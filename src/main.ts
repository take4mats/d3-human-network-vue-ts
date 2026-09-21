import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { createGtag } from "vue-gtag";

const app = createApp(App);

app.use(router);
app.use(vuetify);

if (process.env.NODE_ENV === "production") {
  app.use(createGtag({ tagId: "G-0EBCZGWZWT" }));
}

app.mount("#app");
