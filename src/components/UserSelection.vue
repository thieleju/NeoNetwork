<template>
  <v-row justify="space-around">
    <v-dialog
      v-model="dialog"
      large
      persistent
      width="auto"
      min-width="400px"
      scrim="secondary_dark_2"
    >
      <template v-slot:default="{ isActive }">
        <v-card>
          <v-toolbar
            color="primary_dark"
            title="Select the user you want to use"
          ></v-toolbar>
          <v-card-text class="pr-0">
            <v-list class="overflow-y-auto" max-height="500px">
              <v-list-item
                v-for="user in users"
                link
                @click="user_chosen(user)"
              >
                <template v-slot:prepend>
                  <v-avatar class="my-2" color="grey-darken-3" size="40">
                    <span class="white--text headline">{{ user.name[0] }}</span>
                  </v-avatar>
                </template>
                <v-list-item-content>
                  <v-list-item-title>{{ user.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onMounted } from "vue";

interface User {
  name: string;
}

export default defineComponent({
  name: "UserSelection",
  props: {
    users: {
      type: Array as PropType<Array<User>>,
      required: true,
    },
  },
  emits: ["selected_user"],
  setup(props, ctx) {
    const dialog = ref(true);

    const user_chosen = (user: User) => {
      dialog.value = false;
      console.log(`Chosen user: ${user.name}`);
      ctx.emit("selected_user", user);
    };

    onMounted(() => {});

    return {
      dialog,
      user_chosen,
    };
  },
});
</script>
