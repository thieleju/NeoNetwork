<template>
  <v-app>
    <!-- generate app bar -->
    <v-app-bar app color="secondary_dark">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Neo Network</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" permanent>
      <v-sheet class="pa-4" color="primary_dark">
        <v-avatar class="mb-4" color="grey-darken-3" size="64">
          <span class="white--text headline">{{ user_current.name[0] }}</span>
        </v-avatar>

        <div>
          <v-list-item-title>{{ user_current.name }}</v-list-item-title>
          <v-list-item-subtitle>Online</v-list-item-subtitle>
        </div>
      </v-sheet>

      <v-divider></v-divider>

      <v-list>
        <v-list-item
          v-for="link in links"
          :key="link.icon"
          link
          @click="link.onClick"
        >
          <template v-slot:prepend>
            <v-icon>{{ link.icon }}</v-icon>
          </template>

          <v-list-item-title>{{ link.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main style="background-color: #424242">
      <v-container class="py-8 px-6" fluid>
        <v-row>
          <!-- POSTS -->
          <v-col cols="8">
            <posts
              :posts="posts"
              :user_current="user_current"
              :role="role"
              @update="get_user"
            ></posts>
          </v-col>
          <!-- FRIENDS -->
          <v-col cols="4">
            <friend-list
              :friends="friends"
              :current_user="user_current"
              :role="role"
              @open_profile="dialog_profile = true"
              @add_friend="dialog_friend = true"
            >
            </friend-list>
          </v-col>
        </v-row>
        <!-- CREATE POST BUTTON -->
        <!-- <VLayoutItem model-value position="bottom" class="text-end" size="100">
          <div class="ma-6">
            <VBtn
              icon="mdi-plus"
              size="large"
              color="primary"
              elevation="8"
              @click="dialog_post = true"
            ></VBtn>
          </div>
        </VLayoutItem> -->
      </v-container>
    </v-main>
    <!-- add friend -->
    <v-dialog
      v-model="dialog_friend"
      large
      width="auto"
      min-width="600px"
      scrim="secondary_dark"
    >
      <v-card>
        <v-toolbar color="primary" title="Add new Friend"></v-toolbar>
        <v-card-text class="pa-6">
          <!--  combobox with users -->
          <v-combobox
            v-model="selected_user"
            :items="possible_friends"
            label="Select a user"
            outlined
            hide-details
            class="mb-4"
          ></v-combobox>
        </v-card-text>
        <v-card-action class="pb-4 px-3 text-right">
          <v-btn
            variant="text"
            color="primary"
            @click="add_friend"
            :disabled="!selected_user"
          >
            Add Friend
          </v-btn>
        </v-card-action>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog_profile"
      large
      width="auto"
      min-width="600px"
      scrim="secondary_dark"
    >
      <profile
        :user="user_current"
        :readonly="false"
        @exit="dialog_profile = false"
        @edit_profile="edit_profile"
      ></profile>
    </v-dialog>
  </v-app>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import axios from "../plugins/axios";

import Posts from "../components/Posts.vue";
import Profile from "../components/Profile.vue";
import FriendList from "../components/FriendList.vue";

interface User {
  name: string;
  bio: string;
}

interface Post {
  title: string;
  message: string;
  from: string;
}

export default defineComponent({
  name: "Home",
  components: {
    Posts,
    Profile,
    FriendList,
  },
  props: {
    user_current: {
      type: Object as () => User,
      required: true,
    },
    users: {
      type: Array as () => User[],
      required: true,
    },
  },
  setup(props) {
    let friends = ref<User[]>([]);
    let posts = ref<Post[]>([]);
    let dialog_post = ref(false);
    let title = ref("");
    let message = ref("");
    let selected_user = ref("");
    let dialog_friend = ref(false);
    let dialog_profile = ref(false);
    let user_current = computed(() => props.user_current);
    let user_old = user_current.value.name;
    let role = ref("");

    // mounted hook
    onMounted(() => {
      get_user();
    });

    const possible_friends = computed(() => {
      let frnds = props.users.filter(
        (user) =>
          user.name !== user_current.value.name &&
          friends.value.findIndex((frnd) => frnd.name === user.name) === -1
      );

      return frnds.map((user) => user.name);
    });

    const drawer = ref(true);

    const links = [
      {
        icon: "mdi-view-dashboard",
        text: "Dashboard",
        onClick: () => console.log("Dashboard clicked"),
      },
      {
        icon: "mdi-message",
        text: "Chat",
        onClick: () => console.log("Chat clicked"),
      },
      // {
      //   icon: "mdi-account-edit",
      //   text: "Profile",
      //   onClick: () => (dialog_profile.value = true),
      // },
      // {
      //   icon: "mdi-account-plus",
      //   text: "Add Friend",
      //   onClick: () => (dialog_friend.value = true),
      // },
      // {
      //   icon: "mdi-note-plus",
      //   text: "Create Post",
      //   onClick: () => (dialog_post.value = true),
      // },
      {
        icon: "mdi-logout",
        text: "Logout",
        onClick: () => location.reload(),
      },
    ];

    function get_user() {
      axios
        .post("/user", { user: props.user_current.name })
        .then((response) => {
          let friends_arr: User[] = [];
          let posts_arr: Post[] = [];

          role.value = response.data.role[0]?._fields[0]?.properties.name;

          response.data.friends.forEach((record: any) => {
            friends_arr.push({
              name: record._fields[0],
              bio: record._fields[1],
            });
          });
          response.data.posts.forEach((record: any) => {
            const post: Post = {
              title: record._fields[1],
              message: record._fields[2],
              from: "",
            };
            // set from
            if (record._fields[0] === props.user_current.name)
              post.from = "You"; //record._fields[0];
            else post.from = record._fields[0];

            posts_arr.push(post);
          });
          friends.value = friends_arr;
          posts.value = posts_arr;
        });
    }

    function add_friend() {
      dialog_friend.value = false;

      axios
        .post("/addFriend", {
          user: props.user_current.name,
          friend: selected_user.value,
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          selected_user.value = "";
          get_user();
        });
    }

    function edit_profile({ name, bio }: { name: string; bio: string }) {
      axios
        .post("/editProfile", {
          user: user_old,
          bio,
          new_name: name,
        })
        .then((response) => {});
    }

    return {
      drawer,
      links,
      friends,
      posts,
      dialog_post,
      title,
      message,
      selected_user,
      dialog_friend,
      add_friend,
      user_current,
      possible_friends,
      dialog_profile,
      edit_profile,
      get_user,
      role,
    };
  },
});
</script>

<style>
.sticky {
  position: sticky;
  top: 0;
}
</style>
