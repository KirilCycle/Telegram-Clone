<template>
  <div class="chat-list-wrap">
    <chat-list-item
     
      @click="() => $store.commit('chat/setChatId', cht)"
      v-for="cht in chatList.chats"
      :key="cht"
      :chatId="cht"
    >
  </chat-list-item>
  </div>
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


</style>
