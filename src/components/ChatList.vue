<template>
  <TransitionGroup name="list" class="chat-list-wrap" tag="div">
    <chat-list-item
     
      @click="() => handleChatSelect(cht.id)"
      v-for="cht in chatList"
      :key="cht.id"
      :chat="cht"
      :store-path="storePath"
       
    >
  </chat-list-item>
  </TransitionGroup>
</template>

<script>
import firebase from "firebase/compat/app";
import ChatListItem from "./ChatListItem.vue";
import store from "@/store/store";

export default {
  components: {
    ChatListItem,
  },
  props: {
    chatList: Array,
    storePath: String,
    required: true,
  },
  watch: {
   
  },
  methods: {
    handleChatSelect(id) {
      this.$store.commit('chat/setChatId', id)
    }
  },
  data() {
    return {
      db: firebase.firestore(),
      storePath: this.storePath
      
    }
  },
  created() {
  
   

   

   
  },
};
</script>

<style lang="scss" scoped>
.chat-list-wrap {
 
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
