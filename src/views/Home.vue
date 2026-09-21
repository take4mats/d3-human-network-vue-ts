<template>
  <div id="home" class="grey lighten-1" style="height: 100%">
    <human-network />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import HumanNetwork from "@/components/HumanNetwork.vue"; // @ is an alias to /src

export default defineComponent({
  // eslint-disable-next-line
  name: "Home",
  components: {
    HumanNetwork,
  },
});
</script>
