<script setup lang="ts">
import { ref } from "vue";
import axios from "../plugins/axios";

defineProps<{ msg: string }>();

const count = ref(0);

const data = ref({});

axios
  .get("/data")
  .then((response) => {
    data.value = response.data;
  })
  .catch((error) => {
    console.log(error);
  });
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>

    <p>{{ data }}</p>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
