<template>
  <div>
    
    <div class="user-using-mobile"></div>

    <div v-observer="prev" class="prev"></div>
    <div v-for="i in messages" :key="i.id" class="message">
      <p>
        {{ i.text }}
      </p>
    </div>
    <!-- <div v-observer="next" class="next"></div> -->
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
    const query = ref(null);
    const pivotMessageCreatedAt = ref(null);
    const pivotMessage = ref(null);
    const limit = ref(20);
    const querryType = ref(null);
    const messagesRef = db
      .collection("chatMessages")
      .doc(store.state.chat.chatId)
      .collection("messages");

    watchEffect(() => {
      switch (querryType.value) {
        case "prev":
          query.value = messagesRef
            .orderBy("createdAt", "desc")
            .limit(limit.value);
          break;

        case "next":
          query.value = messagesRef
            .orderBy("createdAt")
            .startAfter(pivotMessage.value)
            .limit(20);
          break;

        default:
          query.value = messagesRef.orderBy("createdAt", "desc").limit(20);
      }
    });

    watchEffect(() => {
      query.value.onSnapshot((snapshot, parameters) => {
        const response = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        querryType.value === "prev"
          ? messages.value = response.reverse()
          : messages.value = response
      });
    });

    async function prev() {
      if (messages.value) {
        querryType.value = "prev";
        limit.value = limit.value + 10;
      }
    }

    // async function next() {
    //   if (messages.value) {
    //     console.log("get next messages", messages.value[20].createdAt);

    //     pivotMessage.value = messages.value[20].createdAt;

    //     querryType.value = "next";
    //   }
    // }

    return {
      messages,
      prev,
      
    };
  },
};
</script>

<style lang="scss" scoped>

.container {
 
}

.message {
  margin: 5px;
  width: 300px;
  height: 200px;
  background-color: #3f3f3f;
}

.prev {
  width: 100%;
  position: relative;
  top: 200px;
}

.next {
  width: 100%;
  height: 10px;
  background-color: #fff;
  position: relative;
  bottom: 200px;
}

p {
  color: white;
}
</style>
