<template>
  <div class="previos-observer" v-observer="previous"></div>
  <div class="msg" v-for="msg in msgs" :key="msg.id">
    {{ msg.text }}
  </div>
  <div  class="next" v-observer="next"></div>
</template>

<script>
import { watchEffect } from "vue";
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
    const chatRef = ref(
      db
        .collection("chatMessages")
        .doc(store.state.chat.chatId)
        .collection("messages")
    );

    watchEffect(() => {
      switch (gettingType.value) {
        case "prev":
          chatQuerry.value = chatRef.value
            .orderBy("createdAt")
            .limitToLast(limit.value)
            .endBefore(pivotMessage.value);
          console.log("WAS");
          break;
        case "next":
          chatQuerry.value = chatRef.value
            .orderBy("createdAt")
            .startAfter(pivotMessage.value)
            .limit(limit.value);
          console.log("WAS 2");
        default:
          chatQuerry.value = chatRef.value
            .orderBy("createdAt", "desc")
            .limit(limit.value);
      }


      chatQuerry.value.onSnapshot((snapshot, parameters) => {
        if (gettingType.value === 'prev') {
          msgs.value = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        } else {
          msgs.value = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .reverse();
        }
      });
    });

    function previous() {
      gettingType.value = "prev";
      const middle = Math.floor((msgs.value.length - 1) / 2);
      pivotMessage.value = msgs.value[middle].createdAt
      console.log("GO ?",middle);
    }

    function next() {
      const middle = Math.floor((msgs.value.length - 1 )/ 2);
      pivotMessage.value = msgs.value[middle].createdAt
      gettingType.value = "next";
      console.log("GO NEXT ?",middle,msgs.value[middle].text );
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
  bottom: 500px;
  background-color: #fff;
  width: 3px;
}

.msg + .msg {
  margin-top: 3px;
  margin-bottom: 3px;
}
</style>
