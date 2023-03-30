<template>
  <chat-list-item
    @click="() => $store.commit('chat/setChatId', cht)"
    v-for="cht in chatList.chats"
    :key="cht"
    :chatId="cht"
  >
</chat-list-item>
</template>

<script>
import store from "@/store/store";
import ChatListItem from "./ChatListItem.vue";
export default {
  components: {
    ChatListItem,
  },
  props: {
    chatList: Array,

    required: true,
  },
  created() {
  console.log(this.serachQ, 'FROM LIST');
  },
};
</script>

<style lang="scss" scoped></style>
