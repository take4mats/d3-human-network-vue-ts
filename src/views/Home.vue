<template>
  <div id="home" class="grey lighten-1">
    <human-network />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  // reactive,
  // computed,
  // watch,
  // onMounted,
} from "@vue/composition-api";

import HumanNetwork from "@/components/HumanNetwork.vue"; // @ is an alias to /src

export default defineComponent({
  name: "Home",
  components: {
    HumanNetwork,
  },
});
</script>
