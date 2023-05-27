<template>
  <div
    v-observer="disableScroll"
    class="block-scroll-to-prevent-stick-to-top"
  ></div>
  <div class="previos-observer" v-observer="previous"></div>


  <!-- <component
   v-for="it in msgs"
    :key="it.id"
    :message="it"
    :isMy="it.userId.includes(firstPartOfmyId)"
     :is="currentChatType(it)"
        >
  </component> -->

  <message-item
    v-for="it in msgs"
    :key="it.id"
    :message="it"
    :isMy="it.userId.includes(firstPartOfmyId)"
  ></message-item>
 <in-loading-msgs-preview></in-loading-msgs-preview>

  

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
import MessageItem from "../MessageItem.vue";
import MessageDefault from "./MessageDefault.vue";
import InLoadingMsgsPreview from './InLoadingMsgsPreview.vue'

export default {
  props: {
    parentRef: Object,
  },
  data() {
    return {
      firstPartOfmyId: store.state.user.user.uid.slice(0, 10),
    };
  },
  components: {
    MessageItem,
    MessageDefault,
    InLoadingMsgsPreview,
  },
  methods: {
    currentChatType(it) {
      if (it.id) {
        return "MessageDefault";
      } 
    },
  },

  setup(props, { emit }) {
    const bottom = ref(null);
    const db = firebase.firestore();
    const top = ref(null);
    const gettingType = ref(null);
    const msgs = ref([]);
    const pivotMessage = ref(null);
    const limit = ref(52);
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
    const firstGettinWas = ref(null);
    const scrollWasDisabled = ref(null);
    const recentMsgID = ref(null);

    function subscribeToRecentMsg() {
      let querry = db
        .collection("chatMessages")
        .doc(store.state.chat.chatId)
        .collection("messages")
        .orderBy("createdAt", "desc")
        .limit(1);

      querry.onSnapshot((snapshot) => {
        recentMsgID.value = snapshot.docs[0].id;
      });
    }

    onMounted(() => {
      subscribeToSnapshot();
      subscribeToRecentMsg();

      const scrollBotomdata = {
        bottomRef: scrollAtTheBottom.value,
      };

      store.commit("chat/setScrollBottomData", scrollBotomdata);
    });

    function handleScrollBtn(isBottom) {
      store.commit("chat/setScrollBottomData", {
        isBottom,
        wasPaginated: !chatQuerry.value ? false : true,
      });
      atTheBottom.value = isBottom;
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
        }
      );
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
    });

    watchEffect(() => {
      if (store.state.chat.chatId !== lastChatId.value) {
        console.log("HA > ");
        store.commit("chat/setChatKey", store.state.chat.chatId);
        lastChatId.value = store.state.chat.chatId;
      }
    });

    watchEffect(() => {
      switch (gettingType.value) {
        case "prev":
          chatQuerry.value = db
            .collection("chatMessages")
            .doc(store.state.chat.chatId)
            .collection("messages")
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
          chatQuerry.value = db
            .collection("chatMessages")
            .doc(store.state.chat.chatId)
            .collection("messages")
            .orderBy("createdAt")
            .startAfter(pivotMessage.value)
            .limit(limit.value);

          if (unsubscribe.value) {
            unsubscribe.value();
            subscribeToSnapshot();
          }

          console.log("WAS 2");
          break;
        default:
          chatQuerry.value = db
            .collection("chatMessages")
            .doc(store.state.chat.chatId)
            .collection("messages")
            .orderBy("createdAt", "desc")
            .limit(limit.value);

          if (unsubscribe.value) {
            unsubscribe.value();
            subscribeToSnapshot();
          }

          console.log("WAS DEF");
      }
    });

    function previous() {
      if (msgs.value.length > limit.value - 1 || gettingType.value === "next") {
        gettingType.value = "prev";
        const middle = Math.floor((msgs.value.length - 1) / 2);

        //-2 as i want see more new data
        pivotMessage.value = msgs.value[middle].createdAt;
        console.log(msgs.value[middle].text, "prev midle");
        console.log("GO ?", middle);
      }
    }

    function next() {
      // if (msgs.value[msgs.value.length - 1].id !== recentMsgID.value) {
      //   gettingType.value = "next";
      //   const middle = Math.floor((msgs.value.length - 1) / 2);
      //   console.log(msgs.value[middle].text, "next midle");
      //   pivotMessage.value = msgs.value[middle].createdAt;
      //   console.log("GO NEXT ?", middle, msgs.value[middle].text);
      // } else if (msgs.value[msgs.value.length - 1].id === recentMsgID.value) {
      //   console.log("def");
      //   console.log("XUY TAM A NE NEXT");
      //   gettingType.value = null;
      // }
      // chatQuerry.value = null;
      // gettingType.value = "next";
      // const middle = Math.floor((msgs.value.length - 1) / 2);
      // console.log(msgs.value[middle].text, "next midle");
      // pivotMessage.value = msgs.value[middle].createdAt;
      // console.log("GO NEXT ?", middle, msgs.value[middle].text);
      // console.log("XUY TAM A NE NEXT");
      // gettingType.value = null;
    }

    function disableScroll() {
      if (gettingType.value === "prev" && limit.value === msgs.value.length) {
        console.log("redirect");
        show();
      }
    }

    function show() {
      props.parentRef.scrollIntoView();

      const scrollContainer = props.parentRef;
      const containerHeight = scrollContainer.clientHeight;
      const contentHeight = scrollContainer.scrollHeight;

      // Calculate the position to scroll to (middle of the list)
      const scrollToPosition = (contentHeight - containerHeight) / 2;

      // Scroll to the desired position
      scrollContainer.scrollTo({
        top: scrollToPosition,
      });
    }

    const skillets = ref([
      { id: 1, text: "" },
      { id: 11234, text: "" },
      { id: 12331239, text: "" },
      { id: 22, text: "" },
      { id: 2345, text: "" },
      { id: 22221, text: "" },
    ]);

    return {
      show,
      bottom,
      skillets,
      previous,
      disableScroll,
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
  background-color: #13b05a;
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

.check-bottom-scroll {
  position: relative;
  bottom: 50px;
}

.block-scroll-to-prevent-stick-to-top {
  position: relative;
  top: 1px;
}

.previos-observer {
  position: relative;
  top: 567px;
}

@media (min-width: 2700px) {
  .previos-observer {
    top: 1367px;
  }
}

.next {
  position: relative;
  bottom: 407px;
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
