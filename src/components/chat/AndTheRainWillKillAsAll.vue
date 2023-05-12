<template>
  <div class="previos-observer" v-observer="previous"></div>
  <div class="msg" v-for="msg in msgs" :key="msg.id">
    {{ msg.text }}
  </div>
  <div class="next" v-observer="next"></div>
</template>

<script>
import { onMounted, watchEffect } from "vue";
import { uuidv4 } from "@firebase/util";
import firebase from "firebase/compat/app";
import { ref } from "vue";
import { query, orderBy, startAt, endBefore } from "firebase/firestore";
import store from "@/store/store";

export default {
  setup() {
    const bottom = ref(null);
    const db = firebase.firestore();
    const top = ref(null);
    const gettingType = ref(null);
    const msgs = ref(null);
    const pivotMessage = ref(null);
    const limit = ref(30);
    const chatQuerry = ref(null);
    const messagesRef = ref(
      db
        .collection("chatMessages")
        .doc(store.state.chat.chatId)
        .collection("messages")
    );
    const prevgettingActionId = ref(null);
    const currentAction = ref(null);
    const unsubscribe = ref(null);

    watchEffect(() => {
      switch (gettingType.value) {
        case "prev":
          chatQuerry.value = messagesRef.value
            .orderBy("createdAt")
            .limitToLast(limit.value)
            .endBefore(pivotMessage.value);

          if (unsubscribe.value) {
            unsubscribe.value();
            subscribeToSnapshot();
          }

          console.log("WAS");
          break;
        case "next":
          chatQuerry.value = messagesRef.value
            .orderBy("createdAt")
            .startAfter(pivotMessage.value)
            .limit(limit.value);

      if (unsubscribe.value) {
            unsubscribe.value();
            subscribeToSnapshot();
          }
          console.log("WAS 2");
        default:
         if (unsubscribe.value) {
            unsubscribe.value();
            subscribeToSnapshot();
          }

          chatQuerry.value = messagesRef.value
            .orderBy("createdAt", "desc")
            .limit(limit.value);
      }

      function subscribeToSnapshot() {
        unsubscribe.value = chatQuerry.value.onSnapshot(
          (snapshot, parameters) => {
            if (gettingType.value === "prev" || gettingType.value === "next" ) {
              msgs.value = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
            } else {
              msgs.value = snapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                .reverse();
            }
          }
        );
      }

      // Function to subscribe to the snapshot listener

      // Initial subscription
      onMounted(() => {
        subscribeToSnapshot();
      });

      // If you need to unsubscribe
      // unsubscribe();

      // If you need to subscribe again
      // subscribeToSnapshot();
    });

    function previous() {
      gettingType.value = "prev";
      const middle = Math.floor((msgs.value.length - 1) / 2);
      pivotMessage.value = msgs.value[middle].createdAt;
      console.log("GO ?", middle);
      currentAction.value = uuidv4();
    }

    function next() {
      gettingType.value = "next";
      const middle = Math.floor((msgs.value.length - 1) / 2);
      pivotMessage.value = msgs.value[middle].createdAt;
      console.log("GO NEXT ?", middle, msgs.value[middle].text);
      currentAction.value = uuidv4();
    }

    return {
      bottom,
      previous,
      msgs,
      next,
      top,
    };
  },
};
</script>

<style lang="scss" scoped>
.msg {
  width: 300px;
  height: 300px;
  background-color: #fff;
}

.previos-observer {
  position: relative;
  top: 730px;
}

.next {
  position: relative;
  bottom: 730px;
}

.msg + .msg {
  margin-top: 3px;
  margin-bottom: 3px;
}
</style>
