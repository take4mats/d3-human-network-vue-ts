<template>
  <v-app>
    <v-app-bar app dense flat class="primary" dark hide-on-scroll>
      <v-btn to="/" text plain>
        <v-icon>mdi-star-david</v-icon>
        &nbsp;
        <pre>d3-human-network</pre>
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <v-icon>mdi-github</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-footer padless dark>
      <v-col class="text-left" cols="12">
        Copyright {{ new Date().getFullYear() }} @take4mats (george)
      </v-col>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",

  data: () => ({
    //
  }),
});
</script>
