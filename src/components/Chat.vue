<template>
  <div>
    <v-card>
      <v-toolbar
        color="primary_dark"
        :title="'Chat with ' + currentFriend?.name"
        height="50"
      ></v-toolbar>

      <!-- CHAT CONTENT -->
      <v-card-text
        class="pa-6"
        style="height: 650px; overflow-y: scroll"
        ref="chatContainer"
      >
        <div
          class="d-flex flex-column align-items-start justify-content-start mb-4"
          v-for="msg in chatMessages"
        >
          <v-card
            :class="{
              'ml-auto': msg.from === user_current.name,
              'mr-auto': msg.from !== user_current.name,
            }"
            color="secondary"
            max-width="500px"
          >
            <v-card-title class="py-2 px-4">{{ msg.from }}</v-card-title>
            <v-card-text class="py-2 px-4">{{ msg.message }}</v-card-text>
          </v-card>
        </div>
        <!-- No messages -->
        <div v-if="chatMessages.length === 0" class="text-center my-4">
          No messages
        </div>
      </v-card-text>
      <v-card-actions>
        <v-text-field
          v-model="message"
          label="Type your message"
          outlined
          hide-details
          @keydown.enter.prevent="sendMessage"
        />
        <v-btn color="primary" @click="sendMessage" variant="icon">
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, nextTick } from "vue";
import axios from "../plugins/axios";

interface ChatMsg {
  message: string;
  from: string;
  to: string;
}

interface User {
  name: string;
  bio: string;
}

export default defineComponent({
  name: "Chat",
  emits: ["update"],
  props: {
    user_current: {
      type: Object as () => User,
      required: true,
    },
    friends: {
      type: Array as () => User[],
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  setup(props, ctx) {
    const chatContainer = ref<HTMLElement | null>(null);
    const chatMessages = ref<ChatMsg[]>([]);
    const message = ref("");
    const currentFriend = ref(props.friends[0]);

    const scrollToBottom = () => {
      const el = chatContainer.value;
      if (el) el.scrollTop = el.scrollHeight;
    };

    const sendMessage = async () => {
      if (!message.value.trim()) return;
      const newMsg: ChatMsg = {
        message: message.value,
        from: props.user_current.name,
        to: currentFriend.value.name,
      };

      const response = await axios.post("/sendMsg", newMsg).catch((err) => {
        console.log(err);
      });
      // console.log(response);

      chatMessages.value.push(newMsg);
      message.value = "";

      await nextTick();
      scrollToBottom();
    };

    return {
      chatContainer,
      chatMessages,
      message,
      currentFriend,
      sendMessage,
    };
  },
});
</script>
