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
import {
  onBeforeUpdate,
  ref,
  onMounted,
  computed,
  watchEffect,
  watch,
} from "vue";
import { getDatabase, onValue } from "firebase/database";
import { updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import ChatInput from "./ChatInput.vue";
import MessageItem from "./MessageItem.vue";
import { query, orderBy, startAt, endBefore } from "firebase/firestore";
import { scrollTo } from "vue-scrollto";
import { limitToFirst, limitToLast, startAfter } from "firebase/database";
import MessagesSkelet from "./MessagesSkelet.vue";
import { settings } from "firebase/analytics";

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
    const top = ref(null);
    const bottom = ref(null);
    const limit = ref(10);
    const query = ref(null);
    const messagesRef = ref(
      db
        .collection("chatMessages")
        .doc(store.state.chat.chatId)
        .collection("messages")
    );

    // setting querry params based client actions
    watchEffect(() => {
      if (props.settings.howGet.action === "endBefore") {
        query.value = messagesRef.value
          .orderBy("createdAt")
          .limitToLast(limit.value)
          .endBefore(props.settings.howGet.message);
      } else if (props.settings.howGet.action === "first") {
        query.value = messagesRef.value
          .orderBy("createdAt")
          // .limit(limit.value)
          .startAfter(props.settings.howGet.message);
      } else {
        query.value = messagesRef.value
          .orderBy("createdAt")
          .limit(limit.value)
          .startAfter(props.settings.howGet.message);
      }
    });

    query.value.onSnapshot(
      // { preserveSnapshot: true },

      (snapshot, parameters) => {
        let response = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("HERE", props.settings.id);
        chat.value = response;
      }
    );

    //standar emit
    watchEffect(() => {
      if (!props.settings.topMessage && chat.value.length) {
        console.log("EMIT", props.settings.id);
        emit("updated", {
          id: props.settings.id,
          topMessage: chat.value[0].createdAt,
          bottomMessage: chat.value[chat.value.length - 1].createdAt,
        });
        top.value = chat.value[0].createdAt;
        bottom.value = chat.value[chat.value.length - 1].createdAt;
      }
    });


    //in case bottom or first message was deleted we need to change this data in subChats settings to give next chat block make right snapshot params  
    watchEffect(() => {
      if (chat.value.length && props.settings.howGet.action !== "first" ) {
        if ( top.value?.seconds !== chat.value[0].createdAt?.seconds ||  top.value?.nanoseconds !== chat.value[0].createdAt?.nanoseconds) {
          
          emit('changes', props.settings.id, chat.value[0].createdAt, chat.value[chat.value.length -1].createdAt)
          console.log( 'pizda');
        }
      //&& top.value?.seconds !== chat.value[0].createdAt?.seconds ||  top.value?.nanoseconds !== chat.value[0].createdAt?.nanoseconds
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
