<template>
  <div class="new-chat">
    <h2>
      {{
        `This is start of your legendary conversation with ${
          $store.state.chat.selectedUser.displayName
            ? $store.state.chat.selectedUser.displayName
            : $store.state.chat.selectedUser.email
        }`
      }}
    </h2>
  </div>
</template>

<script>
import ChatInput from "./ChatInput.vue";
import { collection, getDocs, getDoc, Timestamp } from "firebase/firestore";
import firebase from "firebase/compat/app";
import store from "@/store/store";
import { ref } from "vue";
import { getDatabase, onValue } from "firebase/database";
import { updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { doc, setDoc, writeBatch } from "firebase/firestore";
import DirectChat from "@/components/DirectChat.vue";
import FoundedChatsList from "@/components/FoundedChatsList.vue";
import { getAuth } from "firebase/auth";
import { uuidv4 } from "@firebase/util";



export default {
  components: {
    ChatInput,
  },
  data() {
    return {};
  },

};
</script>

<style lang="scss" scoped>
.new-chat {
  padding-top: 170px;

  h2 {
    color: #393939;
  }
}
</style>
