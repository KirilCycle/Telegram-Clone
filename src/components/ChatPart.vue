<template>
  <div class="chat-part">
    <div v-for="message in chat" :key="message.id" class="msg">
      {{ message.text }}
    </div>
  </div>
</template>

<script>
import { collection, getDocs, getDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import store from "@/store/store";
import { onBeforeUpdate, ref, onMounted, computed, watchEffect } from "vue";
import { getDatabase, onValue } from "firebase/database";
import { updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import ChatInput from "./ChatInput.vue";
import MessageItem from "./MessageItem.vue";
import { query, orderBy, startAt, endBefore } from "firebase/firestore";
import { scrollTo } from "vue-scrollto";
import { limitToFirst, limitToLast, startAfter } from "firebase/database";
import MessagesSkelet from "./MessagesSkelet.vue";

// id: uuidv4(),
//         howGet:  {action:'startAfter', message: 222 },
//         topMessage: null,
//         bottomMessage: null,

export default {
  props: {
    settings: Object,
  },
  setup(props, { emit }) {
    const db = firebase.firestore();
    const chat = ref([]);
    const limit = ref(12);
    const query = ref(null);
    const messagesRef = ref(
      db
        .collection("chatMessages")
        .doc(store.state.chat.chatId)
        .collection("messages")
    );

    onMounted(() => {
      //setting query
    });

    // setting querry params based client actions
    if (props.settings.howGet.action === "endBefore") {
      query.value = messagesRef.value
        .orderBy("createdAt")
        .limitToLast(limit.value)
        .endBefore(props.settings.howGet.message);
    } else if (props.settings.howGet.action === "first") {
      query.value = messagesRef.value
        .orderBy("createdAt", "desc")
        .limit(limit.value);
    } else {
      query.value = messagesRef.value
        .orderBy("createdAt")
        .limit(limit.value)
        .startAfter(props.settings.howGet.message);
    }

    watchEffect(() => {
      query.value.onSnapshot(
        // { preserveSnapshot: true },
        (snapshot, parameters) => {
          let response = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          if (props.settings.howGet.action === 'first') {
              chat.value = response.reverse()
          } else {
            chat.value = response
          }
          
        }
      );

      if (!props.settings.topMessage && chat.value.length) {
        console.log("EMIT", props.settings.id);
        limit.value += 1;
        emit("updated", {
          id: props.settings.id,
          topMessage: chat.value[0],
          bottomMessage: chat.value[chat.value.length - 1],
        });
      }
    });

    // as only one

    return {
      chat,
    };
  },
};
</script>

<style lang="scss" scoped>
.msg {
  width: 300px;
  margin-top: 10px;
  margin-bottom: 10px;
  height: 120px;
  background-color: rgb(93, 145, 241);
}
.chat-part {
  margin: 7px 0px 7px 0px;
  width: 100%;
  border: 3px solid rgb(98, 117, 135);
}
</style>
