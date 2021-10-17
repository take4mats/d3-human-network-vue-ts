<template>
  <div class="dev">
    <Form msg="Welcome to Your Vue.js + TypeScript App" />
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

import Form from "@/components/Form.vue"; // @ is an alias to /src

export default defineComponent({
  name: "Dev",
  components: {
    Form,
  },
});
</script>
