<template>
  <div class="m" v-for="mes in msgs" :key="mes.id">
    {{ mes.text }}
  </div>
</template>

<script>
import { watchEffect } from "vue";
import firebase from "firebase/compat/app";
import { ref } from "vue";
import { query, orderBy, startAt, endBefore } from "firebase/firestore";
import store from "@/store/store";

export default {
  props: {
    settigns: Object,
  },
  setup(props, { emit }) {
    const msgs = ref([]);
    const db = firebase.firestore();
    const limit = ref(30);
    const chatRef = ref(
      db
        .collection("chatMessages")
        .doc(store.state.chat.chatId)
        .collection("messages")
    );
    const chatQuerry = ref(null);
    const lastMsgId = ref(null);
  
  watchEffect(() => {
      switch (props.settigns.type) {
        case "prev":
          chatQuerry.value = chatRef.value
            .orderBy("createdAt")
            .limitToLast(limit.value)
            .endBefore(props.settigns.pivot);
          console.log("WAS");
          break;
        case "next":
          chatQuerry.value = chatRef.value
            .orderBy("createdAt")
            .startAfter(props.settigns.pivot)
            .limit(limit.value);
          console.log("WAS 2");
        default:
          chatQuerry.value = chatRef.value
            .orderBy("createdAt", "desc")
            .limit(limit.value);
      }
  })

    watchEffect(() => {
      chatQuerry.value.onSnapshot((snapshot, parameters) => {
        if (props.settigns.type !== "start") {
          let res = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          msgs.value = res;
          lastMsgId.value = res[res.length - 1];

          if (lastMsgId.value !== res[res.length - 1]?.id) {
            lastMsgId.value = res[res.length - 1].id;
            console.log("EMIT");

            const middle = Math.floor((msgs.value.length - 1) / 2);

            emit("update", msgs.value[middle].createdAt);
          }
        } else {
          let res = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .reverse();

          msgs.value = res;

          if (lastMsgId.value !== res[res.length - 1]?.id) {
            lastMsgId.value = res[res.length - 1].id;
            console.log("EMIT");

            const middle = Math.floor((msgs.value.length - 1) / 2);

            emit("update", msgs.value[middle].createdAt);
          }
        }
      });
    });

    return {
      msgs,
    };
  },
};
</script>
<style lang="scss" scoped>
.m {
  width: 90%;
  height: 300px;
  background-color: #fff;
  margin: 5px;
}
</style>
