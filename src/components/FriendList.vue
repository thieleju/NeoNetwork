<template>
  <v-card min-height="600">
    <v-toolbar
      color="primary_dark"
      :title="'Friends (' + friends.length + ')'"
      height="50"
    >
    </v-toolbar>
    <v-list class="px-6 overflow-y-auto" max-height="800">
      <!-- You -->
      <v-list-item
        class="d-flex align-center"
        link
        @click="$emit('open_profile')"
      >
        <template v-slot:prepend>
          <v-avatar class="my-1" color="grey-darken-3" size="55">
            <span class="white--text headline">You</span>
          </v-avatar>
        </template>
        <v-list-item-content>
          <v-list-item-title>{{ current_user.name }}</v-list-item-title>
        </v-list-item-content>
        <template v-slot:append>
          <v-icon>mdi-account-edit</v-icon>
        </template>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>

    <!-- Friends -->
    <v-list
      class="px-6 overflow-y-auto"
      v-if="friends.length > 0"
      max-height="800"
    >
      <v-list-item
        v-for="(friend, index) in friends"
        :key="index"
        link
        class="d-flex align-center"
        @click="open_profile(friend)"
      >
        <template v-slot:prepend>
          <v-avatar class="my-1" color="grey-darken-3" size="55">
            <span class="white--text headline">{{ friend.name[0] }}</span>
          </v-avatar>
        </template>
        <v-list-item-content>
          <v-list-item-title>{{ friend.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <!-- no friends -->
    <v-card-text v-else>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>No friends yet</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
    <!-- Footer with add Friends button -->
    <div style="position: absolute; bottom: 0; width: 100%">
      <v-divider></v-divider>

      <v-card-actions>
        <v-btn large block color="primary_dark" @click="$emit('add_friend')"
          >Add Friends</v-btn
        >
      </v-card-actions>
    </div>
  </v-card>
  <v-dialog
    v-model="dialog_profile"
    large
    width="auto"
    min-width="600px"
    scrim="secondary_dark"
  >
    <profile
      :user="selected_user"
      :readonly="true"
      :common_friends="common_friends"
      @exit="dialog_profile = false"
    ></profile>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onMounted } from "vue";
import axios from "../plugins/axios";

import Profile from "./Profile.vue";

interface User {
  name: string;
  bio: string;
}

export default defineComponent({
  name: "FriendList",
  emits: ["open_profile", "add_friend"],
  components: {
    Profile,
  },
  props: {
    friends: {
      type: Array as PropType<Array<User>>,
      required: true,
    },
    current_user: {
      type: Object as PropType<User>,
      required: true,
    },
  },
  setup(props, ctx) {
    const dialog = ref(true);
    const dialog_profile = ref(false);
    const common_friends = ref<Array<User>>([]);
    let selected_user = ref<User>({
      name: "",
      bio: "",
    });

    async function open_profile(friend: User) {
      dialog_profile.value = true;
      selected_user.value = friend;

      await get_friends_of_user(friend.name).then((response) => {
        common_friends.value = response;
      });
      console.log(common_friends.value);
    }

    async function get_friends_of_user(otherUser: string) {
      return axios
        .post("/friends", {
          user: props.current_user.name,
          otherUser: otherUser,
        })
        .then((response) => {
          // extract friends names
          return response.data.records.map((record: any) => {
            return record._fields[0];
          });
        })
        .catch((error) => {
          console.log(error);
          return [];
        });
    }

    onMounted(() => {});

    return {
      dialog,
      open_profile,
      dialog_profile,
      selected_user,
      common_friends,
    };
  },
});
</script>
