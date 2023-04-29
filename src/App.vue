<template>
  <Home></Home>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "./plugins/axios";
import Home from "./views/Home.vue";

export default defineComponent({
  name: "App",
  components: {
    Home,
  },
  data() {
    return {
      drawer: true,
      users: [],
      links: [
        ["mdi-inbox-arrow-down", "Inbox"],
        ["mdi-send", "Send"],
        ["mdi-delete", "Trash"],
        ["mdi-alert-octagon", "Spam"],
      ],
    };
  },
  mounted() {
    this.get_users();
  },
  methods: {
    get_users() {
      axios
        .get("/users")
        .then((response) => {
          this.users = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
</script>
