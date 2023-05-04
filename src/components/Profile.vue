<template>
  <v-card>
    <v-toolbar color="primary" :title="user.name"></v-toolbar>
    <v-card-text class="pa-6">
      <v-row>
        <v-col>
          <!-- name -->
          <v-text-field
            v-model="userCopy.name"
            label="Name"
            outlined
            hide-details
            class="mb-4"
            prepend-icon="mdi-account-edit"
            :readonly="!editing"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <!-- bio field -->
          <v-textarea
            v-model="userCopy.bio"
            label="Bio"
            outlined
            prepend-icon="mdi-text-account"
            hide-details
            class="mb-4"
            :placeholder="!readonly ? 'Tell us about yourself' : ''"
            :readonly="!editing"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row v-if="common_friends.length" class="ml-10">
        <v-col>
          <v-list>
            <v-subheader
              >Common Friends ({{ common_friends.length }})</v-subheader
            >
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{
                  common_friends.join(", ")
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-card-text>
    <!-- Buttons -->
    <v-card-action class="pb-4 px-3 text-right" v-if="!readonly">
      <v-btn
        v-if="!readonly"
        @click="resetEdit"
        color="primary"
        variant="text"
        prepend-icon="mdi-undo"
        :disabled="!editing || !resetable"
      >
        Reset
      </v-btn>
      <v-btn
        v-if="!readonly"
        @click="editing = true"
        color="primary"
        variant="text"
        prepend-icon="mdi-pencil"
        :disabled="editing"
      >
        Edit
      </v-btn>
      <v-btn
        v-if="!readonly"
        @click="saveEdit"
        color="primary"
        variant="text"
        prepend-icon="mdi-content-save-edit"
        :disabled="!editing || !resetable"
      >
        Save
      </v-btn>
    </v-card-action>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from "vue";
import axios from "../plugins/axios";

export default defineComponent({
  name: "Profile",
  emits: ["exit", "edit_profile"],
  components: {},
  props: {
    user: {
      type: Object,
      required: true,
    },
    readonly: {
      type: Boolean,
      default: true,
    },
    common_friends: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, ctx) {
    const editing = ref(false);
    const userCopy = ref({ ...props.user });
    const resetable = computed(() => {
      return (
        userCopy.value.name !== props.user.name ||
        userCopy.value.bio !== props.user.bio
      );
    });

    const saveEdit = () => {
      props.user.name = userCopy.value.name;
      props.user.bio = userCopy.value.bio;
      editing.value = false;

      ctx.emit("edit_profile", {
        name: userCopy.value.name,
        bio: userCopy.value.bio,
      });
      ctx.emit("exit");
    };

    const cancelEdit = () => {
      userCopy.value = { ...props.user };
      editing.value = false;
      ctx.emit("exit");
    };

    const resetEdit = () => {
      userCopy.value = { ...props.user };
    };

    watch(
      () => props.user,
      () => {
        userCopy.value = { ...props.user };
      }
    );

    return {
      editing,
      userCopy,
      saveEdit,
      cancelEdit,
      resetEdit,
      resetable,
    };
  },
});
</script>
