<template>
  <!-- User Selection dialog -->
  <UserSelection
    v-if="!user_selected"
    :users="users"
    @selected_user="user_selected = $event"
  ></UserSelection>
  <!-- Home dialog -->
  <Home
    v-if="user_selected"
    :user_current="user_selected"
    :users="users"
  ></Home>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import axios from "./plugins/axios";
import Home from "./views/Home.vue";
import UserSelection from "./components/UserSelection.vue";

interface User {
  name: string;
}

export default defineComponent({
  name: "App",
  components: {
    Home,
    UserSelection,
  },
  setup() {
    const user_selected = ref<User | null>(null);
    const users = ref<Array<User>>([]);

    function generateUsersFromData(data: any): User[] {
      const users: User[] = [];

      data.records.forEach((record: any) => {
        const user = {
          name: record._fields[0].properties.name,
        };
        users.push(user);
      });

      return users;
    }

    const get_users = () => {
      axios
        .get("/users")
        .then((response) => {
          users.value = generateUsersFromData(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    onMounted(() => {
      get_users();
    });

    return {
      user_selected,
      users,
      get_users,
    };
  },
});
</script>

<style>
/* hide the "scrim", it's pointless */
.v-overlay--active .v-overlay__scrim {
  display: none;
}
/* style the overlay container as required */
.v-overlay--active {
  backdrop-filter: blur(2px);
  background: rgb(0 0 0 / 0.8);
}
/* if you have an auto dark theme
   for prefers-color-scheme: dark
   I find the 0.8 too dark
*/
@media (prefers-color-scheme: dark) {
  .v-overlay--active {
    background: rgb(0 0 0 / 0.4);
  }
}
</style>
