<template>
  <TransitionGroup name="list" class="chat-list-wrap" tag="div">
    <chat-list-item
     
      @click="() => $store.commit('chat/setChatId', cht.id)"
      v-for="cht in chatList"
      :key="cht.id"
      :chat="cht"
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
   
  },
  data() {
    return {
      db: firebase.firestore(),
      
    }
  },
  created() {
    console.log(
    
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
