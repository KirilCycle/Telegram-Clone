<template>
  <div>
    <div class="user-using-mobile"></div>

    <div v-observer="prev" class="prev"></div>
    <div v-for="i in messages" :key="i.id" class="message">
      <p>
        {{ i.text }}
      </p>
    </div>
    <div ref="bottom"></div>
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
  setup(props, { emit }) {
    const messages = ref([]);
    const db = firebase.firestore();
    const query = ref(null);
    const limit = ref(20);
    const currentId = ref(null);
    const bottom = ref(null);

    onMounted(() => {
      currentId.value = store.state.chat.chatId;
    });

    watchEffect(() => {

      if ( currentId.value !== store.state.chat.chatId) {
        if (currentId.value) {
          emit("saveLastChatSettings", currentId.value, limit?.value);
        }

        messages.value = [];
        limit.value = 20;
        currentId.value = store.state.chat.chatId;

       console.log( 'CHANGED');
      }
    });

    watchEffect(() => {
      const messagesRef = ref(
        db
          .collection("chatMessages")
          .doc(currentId.value)
          .collection("messages")
      );

      query.value = messagesRef.value
        .orderBy("createdAt", "desc")
        .limit(limit.value);

      query.value.onSnapshot((snapshot, parameters) => {
        const response = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        messages.value = response.reverse();
      });
    });

    async function prev() {
      if (messages.value) {
        limit.value = limit.value + 20;
      }
    }

    return {
      messages,
      prev,
      bottom,
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
