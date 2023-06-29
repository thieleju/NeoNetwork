<template>
  <div>
    <v-card>
      <v-toolbar
        color="primary_dark"
        :title="'Posts (' + posts.length + ')'"
        height="50"
      ></v-toolbar>

      <!-- POST INPUT -->
      <v-card-text class="pa-6">
        <v-text-field
          label="Post Title"
          v-model="title"
          outlined
          hide-details
          class="mb-4"
          prepend-icon="mdi-chat"
          placeholder="No one reads the title anyway..."
        ></v-text-field>
        <v-textarea
          label="Post Content"
          v-model="message"
          outlined
          hide-details
          prepend-icon="mdi-text"
          placeholder="Write something..."
        ></v-textarea>
      </v-card-text>
      <v-row>
        <v-spacer></v-spacer>
        <v-card-action class="pb-4 px-10 text-right" style="text-align: right">
          <v-btn
            variant="text"
            color="primary"
            class=""
            @click="create_post"
            :disabled="!title || !message"
          >
            Post
          </v-btn>
        </v-card-action>
      </v-row>
      <v-divider></v-divider>

      <!-- POSTS -->
      <div v-if="posts.length > 0">
        <div v-for="(post, index) in posts">
          <v-card class="ma-5" color="secondary_dark">
            <v-card-title
              class="d-flex justify-space-between align-center pr-2"
            >
              <div>{{ post.title }}</div>
              <v-btn
                v-if="role === 'admin' || post.from === 'You'"
                icon
                variant="text"
                color="primary_dark"
                elevation="0"
                size="small"
                @click="delete_post(index)"
              >
                <v-icon>mdi-cancel</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text style="word-break: break-word">{{
              post.message
            }}</v-card-text>
            <v-card-subtitle class="pb-4 text-button" style="text-align: right">
              <v-icon>mdi-account</v-icon>
              {{ post.from }}
            </v-card-subtitle>
          </v-card>
        </div>
      </div>

      <v-card-text v-else>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>No Posts yet</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";

import axios from "../plugins/axios";

interface Post {
  title: string;
  message: string;
  from: string;
}

interface User {
  name: string;
  bio: string;
}

export default defineComponent({
  name: "Posts",
  emits: ["update"],
  props: {
    posts: {
      type: Array as () => Post[],
      required: true,
    },
    user_current: {
      type: Object as () => User,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  setup(props, ctx) {
    const title = ref("");
    const message = ref("");

    function create_post() {
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
          ctx.emit("update");
          title.value = "";
          message.value = "";
        });
    }

    function delete_post(index: number) {
      if (props.posts[index].from !== "You" && props.role !== "admin") return;

      const removed = props.posts.splice(index, 1)[0];

      if (removed.from == "You") removed.from = props.user_current.name;

      axios
        .post("/deletePost", {
          user: removed.from,
          title: removed.title,
          message: removed.message,
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          ctx.emit("update");
        });
    }

    return {
      title,
      message,
      create_post,
      delete_post,
    };
  },
});
</script>

<style></style>
