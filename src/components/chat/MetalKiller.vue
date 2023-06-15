<template>
  <div ref="chatScrollWay" class="chat-scroll-way">
    <div
      v-observer="disableScroll"
      class="block-scroll-to-prevent-stick-to-top"
    ></div>
    <div class="previos-observer" v-observer="previous"></div>

    <div class="super-pop" v-if="sus"></div>
    <group-message-item-vue
      v-for="(it, index) in msgs"
      :key="it.id"
      :message="it"
      :isMy="it.userId.includes(firstPartOfmyId)"
      :groupRole="getGroupRole(it.userId, msgs[index + 1]?.userId)"
    >
    </group-message-item-vue>

    <in-loading-msgs-preview></in-loading-msgs-preview>
    <div
      ref="scrollAtTheBottom"
      class="check-bottom-scroll"
      v-desapeared="handleScrollBtn"
    ></div>

    <div class="next" v-observer="next"></div>
  </div>
</template>

<script>
import { onBeforeMount, onMounted, watchEffect } from "vue";
import { uuidv4 } from "@firebase/util";
import firebase from "firebase/compat/app";
import { ref, watch, defineAsyncComponent } from "vue";
import { query, orderBy, startAt, endBefore } from "firebase/firestore";
import store from "@/store/store";
import InLoadingMsgsPreview from "./InLoadingMsgsPreview.vue";
import { isTouchDevice } from "@/features/isTouchDevice";
// import GroupMessageItemVue from "./GroupMessageItem.vue";

export default {
  emits: ["shoveIsAvaible"],
  props: {
    parentRef: Object,
  },

  components: {
    InLoadingMsgsPreview,
    GroupMessageItemVue: defineAsyncComponent(async () => {
      let obj = await import(
        `./${
          isTouchDevice() ? "group-msg-item-mobile" : "group-msg-item"
        }/GroupMessageItem.vue`
      ).finally(() =>
        setTimeout(() => {
          store.state.chatAdditionalDataManage.chatContainerRef.scrollTo({
            top: 100000,
          });
        })
      );
      return obj;
    }),
  },
  data() {
    return {
      firstPartOfmyId: store.state.user.user.uid.slice(0, 10),
    };
  },
  methods: {
    currentChatType(it) {
      if (it.id) {
        return "MessageDefault";
      }
    },
    getGroupRole(userId, nextUserId) {
      if (userId !== nextUserId) {
        return "close";
      }

      return null;
    },
  },

  setup(props, { emit }) {
    const bottom = ref(null);
    const db = firebase.firestore();
    const top = ref(null);
    const gettingType = ref(null);
    const msgs = ref([]);
    const chatScrollWay = ref(null);
    const sus = ref(false);
    const pivotMessage = ref(null);
    const limit = ref(85);
    const chatQuerry = ref(null);
    const unsubscribe = ref(null);
    const isBottom = ref(null);
    const scrollAtTheBottom = ref(null);
    const atTheBottom = ref(null);
    const lastChatId = ref(null);
    const isFirstSrllWasExecuted = ref(null);
    const recentMsgID = ref(null);

    function resetPrevListener() {
      if (unsubscribe.value) {
        unsubscribe.value();
        subscribeToSnapshot();
      }
    }

    function subscribeToRecentMsg() {
      let querry = db
        .collection("chatMessages")
        .doc(store.state.chat.chatId)
        .collection("messages")
        .orderBy("createdAt", "desc")
        .limit(1);

      querry.onSnapshot((snapshot) => {
        if (snapshot.docs.length) {
          recentMsgID.value = snapshot.docs[0].id;
        }
      });
    }

    function handleScrollBtn(isBottom) {
      const isBottomChatPart =
        msgs.value[msgs.value.length - 1]?.id === recentMsgID.value;

      store.commit("chatAdditionalDataManage/setScrollBottomData", {
        isBottom: isBottomChatPart && isBottom,
        //that means queery params focused on other chat parts
        aboveBottomChat: !isBottomChatPart,
      });

      atTheBottom.value = isBottom;
    }
    onMounted(() => {
      subscribeToSnapshot();
      subscribeToRecentMsg();

      emit("shoveIsAvaible", true);

      const scrollBotomdata = {
        bottomRef: scrollAtTheBottom.value,
      };

      store.commit(
        "chatAdditionalDataManage/setScrollBottomData",
        scrollBotomdata
      );
      store.commit(
        "chatAdditionalDataManage/setChatScrollWayRef",
        chatScrollWay.value
      );
      store.commit(
        "chatAdditionalDataManage/setChatGettingMsgsSettings",
        () => {
          chatQuerry.value = null;
          gettingType.value = null;
          pivotMessage.value = null;
        }
      );
    });

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

    watch(
      [pivotMessage, gettingType],
      () => {
        switch (gettingType.value) {
          case "prev":
            chatQuerry.value = db
              .collection("chatMessages")
              .doc(store.state.chat.chatId)
              .collection("messages")
              .orderBy("createdAt")
              .limitToLast(limit.value)
              .endBefore(pivotMessage.value);
            resetPrevListener();

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

            resetPrevListener();

            console.log("WAS 2");
            break;
          default:
            chatQuerry.value = db
              .collection("chatMessages")
              .doc(store.state.chat.chatId)
              .collection("messages")
              .orderBy("createdAt", "desc")
              .limit(limit.value);

            resetPrevListener();

            console.log("WAS DEF");
        }
      },
      { immediate: true }
    );

    watchEffect(() => {
      if (msgs.value.length > 5 && !isFirstSrllWasExecuted.value) {
        //       var target = document.getElementById("target");
        // target.parentNode.scrollTop = target.offsetTop;

        setTimeout(() => {
          // scrollAtTheBottom.value.scrollIntoView({
          //   behavior: "smooth",
          //   block: "nearest",
          //   inline: "start",
          // });

          const scrollContainer = props.parentRef;

          // Calculate the position to scroll to (middle of the list)

          // Scroll to the desired position
          scrollContainer.scrollTo({
            top: 100000,
          });

          console.log(scrollAtTheBottom.value, "AHHAHAHAHAH");
          isFirstSrllWasExecuted.value = true;
        });
      }
    });

    watchEffect(() => {
      if (store.state.chat.chatId !== lastChatId.value) {
        console.log("HA > ");
        store.commit(
          "chatAdditionalDataManage/setChatKey",
          store.state.chat.chatId
        );
        lastChatId.value = store.state.chat.chatId;
      }
    });

    function previous() {
      if (msgs.value.length > limit.value - 1 || gettingType.value === "next") {
        const middle = Math.floor((msgs.value.length - 1) / 2);
        gettingType.value = "prev";
        pivotMessage.value = msgs.value[middle].createdAt;

        store.commit("chatAdditionalDataManage/setScrollBottomData", {
          //that means queery params focused on other chat parts
          aboveBottomChat: true,
        });
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
      if (gettingType.value === "prev" && msgs.value === limit.value) {
        console.log("stop scrolling");
        show();
      }
    }

    function show() {
      props.parentRef.scrollIntoView();
      const scrollContainer = props.parentRef;
      const containerHeight = scrollContainer.clientHeight;
      const contentHeight = scrollContainer.scrollHeight;
      // Calculate the position to scroll to (middle of the list)
      let scrollToPosition = (contentHeight - containerHeight) / 2;

      // Scroll to the desired position
      scrollContainer.scrollTo({
        top: scrollToPosition,
      });
    }

    return {
      sus,
      show,
      bottom,
      previous,
      disableScroll,
      isBottom,
      scrollAtTheBottom,
      msgs,
      next,
      chatScrollWay,
      handleScrollBtn,
      top,
      atTheBottom,
    };
  },
};
</script>

<style lang="scss" scoped>
.super-pop {
  position: absolute;
  width: 100px;
  height: 100px;
  right: 0px;
  background-color: #fff;
  bottom: 0px;
  z-index: 300;
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
  bottom: 90px;
}

.block-scroll-to-prevent-stick-to-top {
  position: relative;
  top: 197px;
}

.previos-observer {
  position: relative;
  top: 367px;
}

@media (min-width: 2700px) {
  .previos-observer {
    top: 967px;
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
