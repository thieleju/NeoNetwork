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
          <v-col cols="8">
            <posts :posts="posts"></posts>
          </v-col>
          <v-col cols="4">
            <v-card class="scrollable-card" height="550">
              <v-toolbar
                color="primary_dark"
                title="Friends"
                height="50"
              ></v-toolbar>
              <v-list class="px-6" v-if="friends.length > 0">
                <v-list-item
                  v-for="(friend, index) in friends"
                  :key="index"
                  link
                  class="d-flex align-center"
                >
                  <template v-slot:prepend>
                    <v-avatar class="my-1" color="grey-darken-3" size="55">
                      <span class="white--text headline">{{ friend[0] }}</span>
                    </v-avatar>
                  </template>
                  <v-list-item-content>
                    <v-list-item-title>{{ friend }}</v-list-item-title>
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
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <!-- add post -->
    <v-dialog
      v-model="dialog_post"
      large
      width="auto"
      min-width="600px"
      persistent
    >
      <template v-slot:default="{ isActive }">
        <v-card>
          <v-toolbar color="primary" title="Create a new post"></v-toolbar>
          <v-card-text class="pa-6">
            <v-text-field
              label="Title"
              v-model="title"
              outlined
              hide-details
              class="mb-4"
            ></v-text-field>
            <v-textarea
              label="Message"
              v-model="message"
              outlined
              hide-details
            ></v-textarea>
          </v-card-text>
          <v-card-action class="pb-4 px-3 text-right">
            <v-btn variant="text" color="primary" @click="dialog_post = false">
              Cancel
            </v-btn>
            <v-btn
              variant="text"
              color="primary"
              @click="create_post"
              :disabled="!title || !message"
            >
              Post
            </v-btn>
          </v-card-action>
        </v-card>
      </template>
    </v-dialog>
    <!-- add friend -->
    <v-dialog
      v-model="dialog_friend"
      large
      width="auto"
      min-width="600px"
      persistent
    >
      <template v-slot:default="{ isActive }">
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
              @click="dialog_friend = false"
            >
              Cancel
            </v-btn>
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
      </template>
    </v-dialog>
  </v-app>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import axios from "../plugins/axios";
import Posts from "../components/Posts.vue";

interface User {
  name: string;
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
    let friends = ref<string[]>([]);
    let posts = ref<Post[]>([]);
    let dialog_post = ref(false);
    let title = ref("");
    let message = ref("");
    let selected_user = ref("");
    let dialog_friend = ref(false);
    let user_current = computed(() => props.user_current);

    // mounted hook
    onMounted(() => {
      get_user();
    });

    const possible_friends = computed(() => {
      let frnds = props.users.filter(
        (user) =>
          user.name !== user_current.value.name &&
          !friends.value.includes(user.name)
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
      {
        icon: "mdi-account-plus",
        text: "Add Friend",
        onClick: () => (dialog_friend.value = true),
      },
      {
        icon: "mdi-note-plus",
        text: "Add Post",
        onClick: () => (dialog_post.value = true),
      },
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
          let friends_arr: string[] = [];
          let posts_arr: Post[] = [];

          response.data.friends.forEach((record: any) => {
            friends_arr.push(record._fields[0]);
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

    function create_post() {
      dialog_post.value = false;

      axios
        .post("/post", {
          title: title.value,
          message: message.value,
          from: props.user_current.name,
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          get_user();
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
          get_user();
        });
    }

    return {
      drawer,
      links,
      friends,
      posts,
      dialog_post,
      title,
      message,
      create_post,
      selected_user,
      dialog_friend,
      add_friend,
      user_current,
      possible_friends,
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
