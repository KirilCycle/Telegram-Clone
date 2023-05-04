<template>
  <div class="chat-wrap">
    <button class="prev" @click="getPrev">show prev</button>

    <chat-part
      @disableCursorMove="disableNextData"
      @updated="setUpdatedData"
      @changes="updateTopOrBottomMessage"
      :settings="part"
      v-for="part in chatPartSettings"
      :key="part.id"
    ></chat-part>

    <button class="next" @click="getNext">show next</button>
  </div>
</template>

<script>
//miracle doesnt exist
// import { collection, getDocs, getDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import store from "@/store/store";
// import { getDatabase, onValue } from "firebase/database";
// import { updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
// import { doc, setDoc } from "firebase/firestore";
// import ChatInput from "./ChatInput.vue";
// import MessageItem from "./MessageItem.vue";
import { query, orderBy, startAt, endBefore } from "firebase/firestore";
// import { scrollTo } from "vue-scrollto";
import { uuidv4 } from "@firebase/util";
// import { onMounted } from "vue";
// import { limitToFirst, limitToLast, startAfter } from "firebase/database";
// import MessagesSkelet from "./MessagesSkelet.vue";
import ChatPart from "./ChatPart.vue";
import { onBeforeUpdate, ref, computed, watchEffect } from "vue";
export default {
  components: {
    ChatPart,
  },
  data() {
    return {
      db: firebase.firestore(),
    };
  },
  methods: {
    async startChat() {
      console.log("GO START");
      const messagesRef = this.db
        .collection("chatMessages")
        .doc(this.$store.state.chat.chatId)
        .collection("messages");

      let query = messagesRef.orderBy("createdAt", "desc").limit(10);

      let qurryToFirstMessage = messagesRef.orderBy("createdAt").limit(1);
      //fisrt message of whole collection
      let firstMessageEver;

      qurryToFirstMessage
        .limit(1)
        .get()
        .then((snapshot) => {
          if (!snapshot.empty) {
            firstMessageEver = snapshot.docs[0].data().createdAt;
          }

          query
            .limit(10)
            .get()
            .then((snapshot) => {
              if (!snapshot.empty) {
                const TopMessageFromLastPartofMessages =
                  snapshot.docs[snapshot.docs.length - 1].data();

                //in case TopMessageFromLastPartofMessages same as first message in whole collection, we need change params, as
                //we will see only after first message, chat can be have
                const startSettings = {
                  id: uuidv4(),
                  howGet: {
                    action: "first",
                    message: TopMessageFromLastPartofMessages.createdAt,
                  },
                  topMessage: null,
                  bottomMessage: null,
                };

                if (firstMessageEver && TopMessageFromLastPartofMessages) {
                  if (
                    JSON.stringify(firstMessageEver) ===
                    JSON.stringify(TopMessageFromLastPartofMessages.createdAt)
                  ) {
                    //change params to see all messages
                    startSettings.howGet.showAll = true;
                  }
                }

                this.chatPartSettings.unshift(startSettings);
              }
            })
            .catch((error) => {
              // Handle any errors
              console.error("Error getting last message:", error);
            });
        })
        .catch((error) => {
          // Handle any errors
          console.error("Error getting last message:", error);
        });
    },
  },
  mounted() {
    this.startChat();
  },
  setup() {
    const db = firebase.firestore();
    const chatPartSettings = ref([]);
    const getNextAvaible = ref(true);
    const getPreviousAvaible = ref(true);

    const selectedChat = ref(null);

    async function startChat() {
      console.log("GO START");
      const messagesRef = db
        .collection("chatMessages")
        .doc(store.state.chat.chatId)
        .collection("messages");

      let query = messagesRef.orderBy("createdAt", "desc").limit(10);

      let qurryToFirstMessage = messagesRef.orderBy("createdAt").limit(1);
      //fisrt message of whole collection
      let firstMessageEver;

      qurryToFirstMessage
        .limit(1)
        .get()
        .then((snapshot) => {
          if (!snapshot.empty) {
            firstMessageEver = snapshot.docs[0].data().createdAt;
          }

          query
            .limit(10)
            .get()
            .then((snapshot) => {
              if (!snapshot.empty) {
                const TopMessageFromLastPartofMessages =
                  snapshot.docs[snapshot.docs.length - 1].data();

                //in case TopMessageFromLastPartofMessages same as first message in whole collection, we need change params, as
                //we will see only after first message, chat can be have
                const startSettings = {
                  id: uuidv4(),
                  howGet: {
                    action: "first",
                    message: TopMessageFromLastPartofMessages.createdAt,
                  },
                  topMessage: null,
                  bottomMessage: null,
                };

                if (firstMessageEver && TopMessageFromLastPartofMessages) {
                  if (
                    JSON.stringify(firstMessageEver) ===
                    JSON.stringify(TopMessageFromLastPartofMessages.createdAt)
                  ) {
                    //change params to see all messages
                    startSettings.howGet.showAll = true;
                  }
                }
                chatPartSettings.value.unshift(startSettings);
              }
            })
            .catch((error) => {
              // Handle any errors
              console.error("Error getting last message:", error);
            });
        })
        .catch((error) => {
          // Handle any errors
          console.error("Error getting last message:", error);
        });
    }

    watchEffect(() => {
      if (!selectedChat.value) {
        selectedChat.value = store.state.chat.chatId;
      }
      if (
        selectedChat.value &&
        store.state.chat.chatId !== selectedChat.value
      ) {
        chatPartSettings.value = [];
        getNextAvaible.value = true;
        getPreviousAvaible.value = true;
        startChat().then(
          (res) => (selectedChat.value = store.state.chat.chatId)
        );
      }
    });

    //action startAfter/endBefore

    const chatPartsetting = {
      id: uuidv4(),
      howGet: { action: "endBefore", message: 111 },
      topMessage: null,
      bottomMessage: null,
    };

    function getPrev() {
      //will get new messages based prev top settings
      if (getPreviousAvaible.value) {
        const newChatPart = {
          id: uuidv4(),
          howGet: {
            action: "endBefore",
            message: chatPartSettings.value[0].topMessage,
          },
          topMessage: null,
          bottomMessage: null,
        };

        chatPartSettings.value.unshift(newChatPart);

        if (chatPartSettings.value.length > 2) {
          chatPartSettings.value.pop();
        }

        getNextAvaible.value = true;
      }
    }

    function getNext() {
      if (getNextAvaible.value && chatPartSettings.value[1]) {
        const newChatPart = {
          id: uuidv4(),
          howGet: {
            action: "startAfter",
            message: chatPartSettings.value[1].bottomMessage,
          },
          topMessage: null,
          bottomMessage: null,
        };

        chatPartSettings.value.push(newChatPart);
        chatPartSettings.value.shift();

        getPreviousAvaible.value = true;
      }
    }

    function setUpdatedData(settings) {
      const link = chatPartSettings.value.findIndex(
        (set) => set.id === settings.id
      );

      chatPartSettings.value[link] = {
        ...chatPartSettings.value[link],
        ...settings,
      };

      console.log(chatPartSettings.value, settings.action === "endBefore");
      if (settings.action === "endBefore") {
        setTimeout(() => {
          chatPartSettings.value[1].ref.scrollIntoView({ block: "start" });
        }, 0);
      }
    }

    function updateTopOrBottomMessage(id, top, bottom) {
      const link = chatPartSettings.value.findIndex((set) => set.id === id);

      chatPartSettings.value[link].topMessage = top;
      chatPartSettings.value[link].bottomMessage = bottom;

      console.log(chatPartSettings.value);
    }

    // Some chat parts say that they reach the top or bottom of the entire collection and we need to prevent observer(top/bottom) calls
    function disableNextData(gettingType) {
      if (gettingType === "endBefore") {
        getNextAvaible.value = true;
        getPreviousAvaible.value = false;
        console.log(gettingType, "PREVENT");
      } else if (gettingType === "startAfter") {
        getPreviousAvaible.value = true;
        getNextAvaible.value = false;
        console.log(gettingType, "PREVENT");
      }
    }
    //i use limit() in case "first" action, and prev settings will still look at old endBefore(data)

    return {
      getPrev,
      disableNextData,
      chatPartSettings,
      getNext,
      setUpdatedData,
      updateTopOrBottomMessage,
    };
  },
};
</script>

<style lang="scss" scoped>
.prev {
  width: 100%;
  height: 50px;
  background-color: #5b42ff;
  color: white;
}
.next {
  @extend .prev;
}
.chat-wrap {
  padding-top: 30px;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  overflow-anchor: none;
}

@media (pointer: coarse) {
  //tch sreen

  .chat-wrap {
    overflow-anchor: none;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
  }
}
</style>
