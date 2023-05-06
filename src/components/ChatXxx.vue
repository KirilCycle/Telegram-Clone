<template>
  <div>
    <button class="prev" @click="prev"></button>
    <div v-for="i in messages" :key="i" class="message">
      <p>
        {{ i }}
      </p>
    </div>
    <button class="next" @click="next"></button>
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";
import { uuidv4 } from "@firebase/util";
import { collection, getDocs, getDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import store from "@/store/store";
import { onBeforeUpdate, computed } from "vue";
import { getDatabase, onValue } from "firebase/database";
import { updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import ChatInput from "./ChatInput.vue";
import MessageItem from "./MessageItem.vue";
import { query, orderBy, startAt, endBefore } from "firebase/firestore";
import { scrollTo } from "vue-scrollto";
import { onMounted } from "vue";
import { limitToFirst, limitToLast, startAfter } from "firebase/database";
import MessagesSkelet from "./MessagesSkelet.vue";

export default {
  data() {},
  setup() {
    const messages = ref([]);
    const db = firebase.firestore();
    const query = ref(null)
    const pivotMessageCreatedAt = ref(null)
    const pivotMessage = ref(null)
    const querryType = ref(null) 
    const messagesRef = db
        .collection("chatMessages")
        .doc(store.state.chat.chatId)
        .collection("messages");

    watchEffect(() => {
       switch(querryType.value) {
        case "prev": 

        break

        case "next":

        default:
            

       }
    });

    watchEffect(() => {});

    async function prev() {}

    async function next() {}

    return {
      messages,
      prev,
      next,
    };
  },
};
</script>

<style lang="scss" scoped>
.message {
  margin: 5px;
  width: 400px;
  height: 200px;
  background-color: #3f3f3f;
}

.prev {
  width: 100%;
  height: 100px;
  background-color: #fff;
}

.next {
  width: 100%;
  height: 100px;
  background-color: #fff;
}

p {
  color: white;
}
</style>
