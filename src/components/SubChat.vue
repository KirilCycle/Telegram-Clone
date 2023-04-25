<template>
  <div class="sub-cht">
    <div v-for="msg in chatPart" :key="msg.id" class="msg">{{msg.text}}</div>
  </div>
</template>

<script>
import { ref, watch, watchEffect } from "vue";
import { collection, getDocs, getDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import store from "@/store/store";
import { onBeforeUpdate } from "vue";
import { getDatabase, onValue } from "firebase/database";
import { updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import ChatInput from "./ChatInput.vue";
import MessageItem from "./MessageItem.vue";
import { query, orderBy, startAt, endBefore } from "firebase/firestore";
import { onMounted } from "vue";
import { limitToFirst, limitToLast, startAfter } from "firebase/database";
import SubChat from "./SubChat.vue";
import { uuidv4 } from "@firebase/util";

export default {
  props: {
    getData: Object,
    required: true,
  },
  setup(props, { emit }) {
    const chatPart = ref([]);

    const db = firebase.firestore();

    const messagesRef = ref(
      db
        .collection("chatMessages")
        .doc(store.state.chat.chatId)
        .collection("messages")
    );

   

    const query = ref(null);

    // const propsTarget = ref({ ...props.data, chatId: store.state.chat.chatId });

    // watch(
    //   [propsTarget, props.getData],
    //   ([refVal1, refVal2], [prevRef1, prevRef2]) => {
    //     /* ... */

    //     console.log("HELLLO");
    //   }
    // );

    watchEffect(() => {

      // console.log("REFETCH :(", props.getData.opirniy, props.getData.type);

      //in case we saw a top observer

      switch (props.getData.type) {
        case "endBefore":
          query.value = messagesRef.value
            .orderBy("createdAt")
            .limitToLast(20)
            .endBefore(props.getData.opirniy.createdAt);

          break;

        case "startAfter":
          query.value = messagesRef.value
            .orderBy("createdAt")
            .startAfter(props.getData.opirniy.createdAt)
            .limit(20);
      }

      query.value.onSnapshot((snapshot, parameters) => {
        chatPart.value = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),

        }))


        emit(
          "dataToNextMove",
          chatPart.value[0],
          chatPart.value[19],
          props.getData.localId,
        );

        console.log("CHAT UPDATED", chatPart.value);
      });
    });

    return {
      chatPart,
    };
  },
};
</script>

<style lang="scss" scoped>
.msg {
  width: 200px;
  height: 85px;
  margin: 5px;
  background-color: #00fa58;
}

.sub-cht {
  border-bottom: 1px solid rgb(46, 31, 255);
  border-top: 1px solid rgb(46, 31, 255);
}
</style>
