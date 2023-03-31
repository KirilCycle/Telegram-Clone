<template>
  <TransitionGroup name="list" class="chat-list-wrap" tag="div">
    <chat-list-item
     
      @click="() => $store.commit('chat/setChatId', cht)"
      v-for="cht in chatList.chats"
      :key="cht"
      :chatId="cht"
    >
  </chat-list-item>
</TransitionGroup>
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
  watch: {
     chatList() {
      console.log('chatlist', this.chatList)
     }
  },
  created() {
  console.log(this.serachQ, 'FROM LIST');
  },
};
</script>

<style lang="scss" scoped>

.chat-list-wrap {
   padding-top: 10px;
   padding-bottom: 20px;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

</style>
