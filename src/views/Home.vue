<template>
  <div class="dev">
    <human-network msg="Welcome to Your Vue.js + TypeScript App" />
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
