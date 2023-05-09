<template>
  <div ref="scrollDiv"></div>
  <div v-for="message in chat" :key="message.id" class="msg">
    {{ message.text }}
  </div>
  <div ref="scrollBott"></div>
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
// import { getDatabase, onValue } from "firebase/database";
// import { updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
// import { doc, setDoc } from "firebase/firestore";
// import ChatInput from "./ChatInput.vue";
// import MessageItem from "./MessageItem.vue";
// import { query, orderBy, startAt, endBefore } from "firebase/firestore";
// import { scrollTo } from "vue-scrollto";
// import { limitToFirst, limitToLast, startAfter } from "firebase/database";
// import MessagesSkelet from "./MessagesSkelet.vue";
// import { settings } from "firebase/analytics";

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
    const scrollDiv = ref(null);
    const scrollBott = ref(null);
    const messagesRef = ref(
      db
        .collection("chatMessages")
        .doc(store.state.chat.chatId)
        .collection("messages")
    );

    // setting querry params based client actions
    watchEffect(() => {
      console.log("querry settings");
      if (props.settings.howGet.action === "endBefore") {
        query.value = messagesRef.value
          .orderBy("createdAt")
          .limitToLast(limit.value)
          .endBefore(props.settings.howGet.message.createdAt);
        console.log("endBEfore");
      } else if (props.settings.howGet.action === "first") {
        if (!props.settings.howGet.showAll) {
          //chat already quite long
          console.log("first long chat");
          query.value = messagesRef.value
            .orderBy("createdAt")
            .startAfter(props.settings.howGet.message.createdAt);
        } else {
          console.log("first  showAll");
          //chat to small we dont need use startAfter as we will avoid first msg
          query.value = messagesRef.value.orderBy("createdAt");
        }
      } else {
        //case startAfter
        console.log("ase startAfter");
        query.value = messagesRef.value
          .orderBy("createdAt")
          .limit(limit.value)
          .startAfter(props.settings.howGet.message.createdAt);
      }
    });

    query.value.onSnapshot(
      // { preserveSnapshot: true },
      (snapshot, parameters) => {
        let response = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        chat.value = response;

        //in case response less than required limit (mean cursor beyond collection it can bee as top of whole collection or bottom )
        //so we need
        //prevent adding new chat part
      }
    );

    //standar emit at first chat part apppear (will invoke only once)  during messages changes we will change it to in main chatSettings
    watchEffect(() => {
      if (!props.settings.topMessage && chat.value.length) {
        const topMsgData = {
          createdAt: chat.value[0].createdAt,
          id: chat.value[0].id,
        };
        const bottomMsgData = {
          createdAt: chat.value[chat.value.length - 1].createdAt,
          id: chat.value[chat.value.length - 1].id,
        };

        emit("updated", {
          id: props.settings.id,
          topMessage: topMsgData,
          bottomMessage: bottomMsgData,
          ref: scrollDiv.value,
          refBot: scrollBott.value,
          action: props.settings.howGet.action,
        });

        top.value = bottomMsgData;
        bottom.value = topMsgData;
      }
    });

    //in case bottom or first message was deleted we need to change this data in subChats settings to give next chat block make right snapshot params
    watchEffect(() => {
      if (chat.value.length && props.settings.howGet.action) {
        if (top.value.id === chat.value[0].id) {
       
         const topMsgData = {
            createdAt: chat.value[0].createdAt,
            id: chat.value[0].id,
          };
          const bottomMsgData = {
            createdAt: chat.value[chat.value.length - 1].createdAt,
            id: chat.value[chat.value.length - 1].id,
          };

          emit(
            "changes",
            props.settings.id,
            topMsgData,
            bottomMsgData,
          );
        }
        //&& top.value?.seconds !== chat.value[0].createdAt?.seconds ||  top.value?.nanoseconds !== chat.value[0].createdAt?.nanoseconds
      }
    });

    //setting scroll ref only once to every exisiting chat setttings
    // watchEffect(() => {
    //   if (!props.settings.ref && scrollDiv.value) {
    //     emit("updated", {
    //       id: props.settings.id,
    //       ref: scrollDiv.value,
    //     });
    //   }
    // });

    return {
      scrollDiv,
      chat,
      scrollBott,
    };
  },
};
</script>

<style lang="scss" scoped>
.bottom-scroll {
  width: 100%;
  height: 1px;
  color: red;
}
.msg {
  width: 300px;
  margin-top: 10px;
  margin-bottom: 10px;
  height: 120px;
  background-color: rgb(93, 145, 241);
}
.chat-part {
  width: 100%;
}
</style>
