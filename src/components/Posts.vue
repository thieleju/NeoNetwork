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
        <div v-for="post in posts">
          <v-card class="ma-5" color="secondary_dark">
            <v-card-title class="text-h5">{{ post.title }}</v-card-title>
            <v-card-text style="white-space: pre">{{
              post.message
            }}</v-card-text>
            <v-card-subtitle class="pb-4 text-button" style="text-align: right">
              <v-icon>mdi-account</v-icon>
              {{ post.from }}</v-card-subtitle
            >
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
        });
    }

    return {
      title,
      message,
      create_post,
    };
  },
});
</script>

<style></style>
