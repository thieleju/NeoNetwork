<template>
  <div>
    <v-card>
      <v-toolbar color="primary_dark" title="Posts" height="50"></v-toolbar>
      <div v-if="posts.length > 0">
        <v-card v-for="post in posts" class="ma-5" color="secondary_dark">
          <v-card-title class="text-h5">{{ post.title }}</v-card-title>
          <v-card-text style="white-space: pre">{{ post.message }}</v-card-text>
          <v-card-subtitle class="pb-4 text-button" style="text-align: right">
            <v-icon>mdi-account</v-icon>
            {{ post.from }}</v-card-subtitle
          >
        </v-card>
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

interface Post {
  title: string;
  message: string;
  from: string;
}

export default defineComponent({
  name: "Posts",
  props: {
    posts: {
      type: Array as () => Post[],
      required: true,
    },
  },
  setup() {},
});
</script>

<style></style>
