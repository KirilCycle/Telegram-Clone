<template>
  <button v-show="!atTheBottom" class="scroll-bottom"></button>
  <div class="previos-observer" v-observer="previous"></div>

  <div class="msg" v-for="msg in msgs" :key="msg.id">
    {{ msg.text }}
  </div>
  <div
    ref="scrollAtTheBottom"
    class="check-bottom-scroll"
    v-desapeared="handleScrollBtn"
  ></div>
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
  data() {},
  props: {
    parentRef: Object,
  },

  setup(props, { emit }) {
    const bottom = ref(null);
    const db = firebase.firestore();
    const top = ref(null);
    const gettingType = ref(null);
    const msgs = ref([]);
    const pivotMessage = ref(null);
    const limit = ref(30);
    const chatQuerry = ref(null);
    const messagesRef = ref(
      db
        .collection("chatMessages")
        .doc(store.state.chat.chatId)
        .collection("messages")
    );
    const currentAction = ref(null);
    const unsubscribe = ref(null);
    const isBottom = ref(null);
    const scrollAtTheBottom = ref(null);
    const atTheBottom = ref(null);
    const lastChatId = ref(null);
    const invokeStartChat = ref(null);
    const isFirstSrllWasExecuted = ref(null);

    function handleScrollBtn(isBottom) {
      atTheBottom.value = isBottom;
    }

    watchEffect(() => {
      if (msgs.value.length > 5 && !isFirstSrllWasExecuted.value) {
        setTimeout(() => {
          scrollAtTheBottom.value.scrollIntoView({
            block: "start",
            inline: "start",
          });
          console.log(scrollAtTheBottom.value, "AHHAHAHAHAH");
          isFirstSrllWasExecuted.value = true;
        });
      }
      console.log(props.parentRef, "REFKA");
    });

    watchEffect(() => {
      if (store.state.chat.chatId !== lastChatId.value) {
        console.log("HA > ");
        emit("update", store.state.chat.chatId);
        lastChatId.value = store.state.chat.chatId;
      }
    });

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
            if (gettingType.value === "prev" || gettingType.value === "next") {
              msgs.value = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
            } else {
              msgs.value = snapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                .reverse();
            }
            if (atTheBottom.value) {
              setTimeout(() => {
                scrollAtTheBottom.value.scrollIntoView({
                  block: "start",
                  inline: "start",
                  behavior: "smooth",
                });
              });
            }

            // if (navigator.userAgentData.mobile && window.innerWidth < 550) {
            //    props.parentRef.scrollIntoView({ block: 'center', behavior: 'smooth' })
            // }
          }
        );
      }

      onMounted(() => {
        subscribeToSnapshot();
      });
      // Function to subscribe to the snapshot listener
      // Initial subscription
      // onMounted(() => {
      // });

      // If you need to unsubscribe
      // unsubscribe();

      // If you need to subscribe again
      // subscribeToSnapshot();
    });

    function previous() {
      if (msgs.value.length > 29 || gettingType.value === "next") {
        gettingType.value = "prev";
        const middle = Math.floor((msgs.value.length - 1) / 2);
        pivotMessage.value = msgs.value[middle].createdAt;
        console.log(msgs.value[middle].text, "prev midle");
        console.log("GO ?", middle);
        currentAction.value = uuidv4();
      }
    }

    function next() {
      if (msgs.value.length > 29) {
        gettingType.value = "next";
        const middle = Math.floor((msgs.value.length - 1) / 2);
        console.log(msgs.value[middle].text, "next midle");
        pivotMessage.value = msgs.value[middle].createdAt;
        console.log("GO NEXT ?", middle, msgs.value[middle].text);
        currentAction.value = uuidv4();
      } else {
        console.log("XUY TAM A NE NEXT");
        gettingType.value = null;
      }
    }

    return {
      bottom,
      previous,
      isBottom,
      scrollAtTheBottom,
      msgs,
      next,
      handleScrollBtn,
      top,
      atTheBottom,
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
.scroll-bottom {
  width: 30px;
  height: 30px;
  background-color: #fff;
  border-radius: 50%;
  position: absolute;
  bottom: 100px;
  right: 5px;
}

.mobile-scroll-target {
  background-color: red;
  position: relative;
  height: 1px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.check-bottom-scroll {
  position: relative;
  bottom: 50px;
}

.previos-observer {
  position: relative;
  top: 630px;

}

.next {
  position: relative;
  bottom: 630px;
}

@media (min-height: 1200px) {
}

@media (max-width: 500px) {
  /* Styles for touchscreen devices */
  .previos-observer {
    top: 0px;
  }

  .next {
    bottom: 0px;
  }
}

@media (pointer: fine) {
  /* Styles for non-touchscreen devices */
}

.msg + .msg {
  margin-top: 3px;
  margin-bottom: 3px;
}
</style>
