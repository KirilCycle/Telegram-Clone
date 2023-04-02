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
import firebase from "firebase/compat/app";
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
      console.log("chatlist SSSSSSSSSSSSSSSSSSSSSSSSSS@@@@@@@@", this.chatList);
    },
  },
  data() {
    return {
      db: firebase.firestore(),
      ours: []
    }
  },
  created() {
    console.log(
      "chatlist SSSSSSSSSSSSSSSSSSSSSSSSSS@@@@@@@@",
      this.chatList.chats
    );
   

    async function fetchChat(chatId) {
      
      const db = firebase.firestore()
      
      const myCollectionRef = db.collection("chats");

      const documentRef = myCollectionRef.doc(chatId);
      console.log('EEEEEEEEEEEEEEEEEEEXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
      console.log('EX')

      
      // Retrieve the document using the get() method
      documentRef.onSnapshot((doc) => {
        console.log(doc.data());
      });
    }

    if (this.chatList.chats) {
      console.log('EX')
      this.chatList.chats.map((el) => fetchChat(el));
    }
  },
};
</script>

<style lang="scss" scoped>
.chat-list-wrap {
  padding-top: 10px;
  padding-bottom: 40px;
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
