<template>
  <chat-item
    @click="() => $store.commit('chat/setChatId', cht)"
    v-for="cht in chatList.chats"
    :key="cht"
    :chatId="cht"
  >
  </chat-item >
</template>

<script>
import store from "@/store/store";
import ChatItem from "./ChatItem.vue";
export default {
  components: {
    ChatItem,
  },
  props: {
    chatList: Array,
    required: true,
  },
};
</script>

<style lang="scss" scoped></style>
