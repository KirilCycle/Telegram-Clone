<template>
  <div class="chat-wrap">
    <div v-observer="getPrev"></div>
    <!-- <button class="prev" @click="getPrev">show prev</button> -->

    <chat-part
      @loaded="loading = null"
      @disableCursorMove="disableNextData"
      @updated="setUpdatedData"
      @changes="updateTopOrBottomMessage"
      :settings="part"
      v-for="part in chatPartSettings"
      :key="part.id"
    ></chat-part>

    <!-- <button class="next" @click="getNext">show next</button> -->
    <div v-desapeared="bottomWasleaved"></div>
    <div class="get-next-observer" v-observer="getNext"></div>
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
import { onBeforeUpdate, ref, computed, watchEffect, onMounted } from "vue";
export default {
  components: {
    ChatPart,
  },
  data() {
    return {
      db: firebase.firestore(),
    };
  },

  setup() {
    const db = firebase.firestore();
    const chatPartSettings = ref([]);
    const getNextAvaible = ref(true);
    const getPreviousAvaible = ref(true);
    const loading = ref(null);
    const chasingBottom = ref(null);
    const theMostRecentMessage = ref(null);
    const currrentChatId = ref(null);
    const messagesRef = ref(
      db
        .collection("chatMessages")
        .doc(store.state.chat.chatId)
        .collection("messages")
    );

    

    watchEffect(() => {
     if (currrentChatId.value !== store.state.chat.chatId)  {
      console.log( 'enother');
      currrentChatId.value = store.state.chat.chatId
      chatPartSettings.value = []
      startChat()
     } 6666
    })


    const qurryRecentMessageQuerry = ref(
      messagesRef.value.orderBy("createdAt", "desc").limit(1) // Limit the result to 1 document
    );

    qurryRecentMessageQuerry.value.onSnapshot(
      // { preserveSnapshot: true },
      (snapshot, parameters) => {
        if (snapshot.docs[0]) {
          theMostRecentMessage.value = snapshot.docs[0].data().createdAt;
        }
      }
    );

    const chatPartsetting = {
      //action startAfter/endBefore
      id: uuidv4(),
      howGet: { action: "endBefore", message: 111 },
      topMessage: null,
      bottomMessage: null,
    };

    async function startChat() {
      console.log("GO START CHAT");
      const messagesRef = db
        .collection("chatMessages")
        .doc(store.state.chat.chatId)
        .collection("messages");

     

      let qurryToFirstMessage = messagesRef.orderBy("createdAt").limit(1);
      //fisrt message of whole collection
      let firstMessageEver;

      qurryToFirstMessage
        .get()
        .then((snapshot) => {
          if (!snapshot.empty) {
            firstMessageEver = snapshot.docs[0].data().createdAt;
          }
          let query = messagesRef.orderBy("createdAt", "desc").limit(10);

          query
            .get()
            .then((snapshot) => {
              if (!snapshot.empty) {
                const TopMessageFromLastPartofMessages =
                  snapshot.docs[snapshot.docs.length - 1].data();

                console.log(
                  TopMessageFromLastPartofMessages,
                  firstMessageEver,
                  "VERSUS"
                );
                //in case TopMessageFromLastPartofMessages same as first message in whole collection, we need change params, as
                //we will see only after first message, chat can be have
                const startSettings = {
                  id: uuidv4(),
                  howGet: {
                    action: "first",
                    text: TopMessageFromLastPartofMessages.text,
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
                    console.log("showAll = true");
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

    //detectig if we already reach bottom of collection
    watchEffect(() => {
      if (theMostRecentMessage.value && chatPartSettings.value[0]) {
        if (
          JSON.stringify(chatPartSettings.value[0].bottomMessage) ===
          JSON.stringify(theMostRecentMessage.value)
        ) {
          console.log("YES AS THE BOTTOM");
        } else if (
          chatPartSettings.value[1] &&
          JSON.stringify(chatPartSettings.value[1].bottomMessage) ===
            JSON.stringify(theMostRecentMessage.value)
        ) {
          console.log("YES AS THE BOTTOM");
        }
      }
    });


    function getPrev() {
      //will get new messages based prev top settings
 
      if (getPreviousAvaible.value && chatPartSettings.value[0]) {
        console.log("PREV", chatPartSettings.value[0]);
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
        loading.value = true;

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

        loading.value = true;
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

      if (settings.action === "endBefore") {
        setTimeout(() => {
          chatPartSettings.value[1].ref.scrollIntoView({ block: "start" });
        }, 0);
      } else if (settings.action === "startAfter") {
        setTimeout(() => {
          chatPartSettings.value[0].refBot.scrollIntoView({ block: "end" });
        }, 0);
      }
    }

    function updateTopOrBottomMessage(id, top, bottom) {
      const link = chatPartSettings.value.findIndex((set) => set.id === id);

      chatPartSettings.value[link].topMessage = top;
      chatPartSettings.value[link].bottomMessage = bottom;
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

    function bottomWasleaved(observedState) {}
    //i use limit() in case "first" action, and prev settings will still look at old endBefore(data)

    return {
      getPrev,
      bottomWasleaved,
      disableNextData,
      chatPartSettings,
      getNext,
      loading,
      setUpdatedData,
      updateTopOrBottomMessage,
    };
  },
};
</script>

<style lang="scss" scoped>

.get-next-observer {
  width: 100%;
  height: 1px;
  background-color: #fff;
}

.prev {
  width: 100%;
  height: 50px;
  background-color: #5b42ff;
  color: white;
}
.bottom {
  height: 4px;
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
