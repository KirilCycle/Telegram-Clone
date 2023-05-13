<template>
  <message-actions v-if="$store.state.message.visible"></message-actions>

  <div class="main">
    <div class="left-bar">
      <div class="btn-controll">
        <chats-control-btn></chats-control-btn>
      </div>

      <div class="left_bar_srch-wrap" placeholder="search chat">
        <settings></settings>

        <input
          placeholder="Search"
          @input="(e) => serachChat(e.target.value)"
        />
        <button
          @click="isSearch = !isSearch"
          :class="{
            left_bar_srch_wrap_settings: !isSearch,
            left_bar_srch_wrap_settings_active: isSearch,
          }"
        >
          <span class="material-symbols-outlined"> language </span>
        </button>
      </div>

      <div @click="chatHided = true" v-show="!isSearch" class="chat-list">
        <chat-list :storePath="'chat'" :chatList="chatList"></chat-list>
      </div>

      <div v-if="isSearch" @click="chatHided = true">
        <founded-chats-list></founded-chats-list>
      </div>
    </div>

    <Transition>
      <div
        ref="chat"
        :class="{
          'right-side-shoved-back': chatHided,
          'right-side': !chatHided,
        }"
      >
        <div
          @touchmove.prevent="() => {}"
          v-if="$store.state.chat.selectedUser"
          class="chat-nav-x"
        >
          <button>
            <span @click="chatHided = false" class="material-symbols-outlined">
              chevron_left
            </span>
          </button>

          <selected-chat-nav></selected-chat-nav>

          <h3>{{ navName }}</h3>

          <chat-settings></chat-settings>
        </div>

        <div ref="chatContainer" class="chat-container-x">
          <component
            @saveLastChatSettings="saveChatSettings"
            :is="currentChatType"
            :key="chatKey"
            @update="update"
          >
          </component>
        </div>

        <div
          v-if="$store.state.chat.chatId || $store.state.chat.selectedUser"
          class="chat-input-block-x"
        >
          <div class="input-wrap">
            <div v-if="$store.state.chat.selectedUser.new">
              <founded-chat-input-vue
                :sendMsg="sendMessageToFoundedChat"
              ></founded-chat-input-vue>
            </div>

            <div v-else>
              <chat-input :sendMsg="addNewMessage"></chat-input>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import { collection, getDocs, getDoc, Timestamp } from "firebase/firestore";
import firebase from "firebase/compat/app";
import store from "@/store/store";
import { ref } from "vue";
import { getDatabase, onValue } from "firebase/database";
import { updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { doc, setDoc, writeBatch } from "firebase/firestore";
import DirectChat from "@/components/DirectChat.vue";
import FoundedChatsList from "@/components/FoundedChatsList.vue";
import { getAuth } from "firebase/auth";
import { uuidv4 } from "@firebase/util";
import ChatList from "@/components/ChatList.vue";
import ChatInput from "@/components/ChatInput.vue";
import NewChat from "@/components/NewChat.vue";
import { watchEffect } from "vue";
import ChatisntSelected from "@/components/ChatisntSelected.vue";
import ReplyMessageBorder from "@/components/ReplyMessageBorder.vue";
import SelectedChatNav from "@/components/SelectedChatNav.vue";
import MessageActions from "@/components/MessageActions.vue";
import Settings from "@/components/Settings.vue";
import ChatSettings from "@/components/ChatSettings.vue";
import SelectedChat from "@/components/SelectedChat.vue";
import SelectedChatDynamic from "@/components/SelectedChatDynamic.vue";
import FoundedChatInputVue from "@/components/FoundedChatInput.vue";
import ChatsControlBtn from "@/components/ChatsControlBtn.vue";
import ChatXxx from "@/components/ChatXxx.vue";
import Chat from "@/components/Chat";
import AndTheRainWillKillAsAll from "@/components/chat/AndTheRainWillKillAsAll";

import Vue from "vue";
import { computed, reactive } from "vue";
import { useStore } from "vuex";

export default {
  components: {
    DirectChat,
    AndTheRainWillKillAsAll,
    ChatXxx,
    Chat,
    ReplyMessageBorder,
    SelectedChatDynamic,
    NewChat,
    ChatisntSelected,
    FoundedChatsList,
    FoundedChatInputVue,
    ChatList,
    ChatsControlBtn,
    Settings,
    SelectedChat,
    ChatInput,
    SelectedChatNav,
    MessageActions,
    ChatSettings,
  },
  data() {
    return {
      isSearch: false,
      value: "",
      chatKey: 's',
      serachQ: "",
    };
  },
  computed: {
    handleWhichTypeOfChatWasSelected() {
      if (store.state.chat.selectedUser?.new) {
        ("NewChat");
      } else if (store.state.state.chat.chatId) {
        ("DirectChat");
      }
      return "ChatisntSelected";
    },
  },
  mounted() {
    this.$store.commit("chat/setChatContainerRef", this.$refs.chatContainer);
  },
  methods: {
      update(changeId) {
      if (changeId !== this.chatKey) {
       console.log(   'UPDATED');
        this.chatKey = changeId
      }
    },
    async test() {
      const db = firebase.firestore();
      const batch = writeBatch(db);

      const messagesRef = db
        .collection("rooms")
        .doc("chatIds")
        .collection("messages");
      batch.set(messagesRef.doc(), { a: "54" });

      await batch
        .commit()
        .then(() => {
          console.log("Batch operation successful");
        })
        .catch((error) => {
          console.error("Batch operation failed:", error);
        });
    },

    async addNewMessage(text, source, replyData) {
      const db = firebase.firestore();
      const chatRefMsg = doc(db, "chatMessages", store.state.chat.chatId);

      const auth = getAuth();

      const nextVerify = text.length > 0 || source;

      if (text.length < 2000 && nextVerify) {
        const message = {
          userName: auth.currentUser.displayName
            ? auth.currentUser.displayName.slice(0, 25)
            : auth.currentUser.email.slice(
                0,
                auth.currentUser.email.indexOf("@")
              ),
          userId: auth.currentUser.uid,
          text,
          createdAt: Timestamp.now(),
          // createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        };
        if (auth.currentUser.photoURL) {
          message.userPhotoURl = auth.currentUser.photoURL;
        }

        if (source) {
          //   messageisNotReady.value = true;
          message.source = source;
        }

        if (replyData) {
          message.replyData = replyData;
        }

        const chatRefMsg = db
          .collection("chatMessages")
          .doc(store.state.chat.chatId)
          .collection("messages");

        console.log(chatRefMsg, "AS SEND");

        chatRefMsg.add(message).then((res) => console.log("res", res));

        const user1usersChatRef = doc(
          db,
          "usersLinksToChat",
          auth.currentUser.uid
        );
        const user2usersChatRef = doc(
          db,
          "usersLinksToChat",
          store.state.chat.chatId.replace(auth.currentUser.uid, "")
        );

        const lastMsgData = {
          text,
          createdAt: message.createdAt,
          from: message.userName,
        };

        await updateDoc(user1usersChatRef, {
          [store.state.chat.chatId]: {
            lastMsg: lastMsgData,
            id: store.state.chat.chatId,
          },
        });

        await updateDoc(user2usersChatRef, {
          [store.state.chat.chatId]: {
            lastMsg: lastMsgData,
            id: store.state.chat.chatId,
          },
        });

        //set this chat id at the first position on both users
        //i cnat manipulate with index directly
      }
    },

    serachChat(query) {
      query.length > 0
        ? store.commit("chat/setQuery", query.toLowerCase())
        : store.commit("chat/setQuery", null);
    },
  },

  computed: {
    navName() {
      const user = store.state.chat.selectedUser;

      if (user) {
        if (user?.displayName) {
          return user.displayName;
        } else {
          return user.email
            ? user.email.slice(0, user.email.indexOf("@"))
            : "loading";
        }
      }
    },
  },

  setup(data) {
    // function Fn1(res) {
    //   console.log( "res Fn1",res);
    //   return "res Fn1";
    // }
    // function Fn2(res) {
    //   console.log( "res Fn2",res);
    //   return "res Fn2";
    // }
    // function Fn3(res) {
    //   console.log( "res Fn3",res);
    //   return "res Fn3";
    // }
    // function Fn4(res) {
    //   console.log( "res Fn4",res);
    //   return "res Fn4";
    // }
    // function Fn5(res) {
    //  console.log( "res Fn5",res);
    //   return "res Fn5";
    // }

    // const fns = ref([Fn1, Fn2, Fn3, Fn4, Fn5,]);

    // // Fn1(Fn2(Fn3(Fn4(Fn5))))

    // let iterations = ref(fns.value.length);

    // function useAllOfThem(res) {
    //   if (iterations.value !== 0) {
    //     const resPrev = fns.value[iterations.value - 1](res);

    //     iterations.value -= 1;

    //     useAllOfThem(resPrev)
    //   }
    // }

    // useAllOfThem();

    const db = firebase.firestore();
    // const docRef = doc(db, "usersLinksToChat", "loVxhSxDf7dbHOJ6Sjmtdr1tyZ52");

    const collectionRef = db.collection("usersLinksToChat");

    const chatList = ref("");

    const listLoaded = ref(null);

    const currentChatType = ref("ChatisntSelected");

    collectionRef.doc(store.state.user.user.uid).onSnapshot((doc) => {
      if (doc.exists) {
        const source = doc.data();

        const formated = Object.values(source);
        // Do something with the document data
        store.commit("chat/setChatIdList", formated);

        chatList.value = formated.sort(
          (a, b) => b.lastMsg.createdAt.seconds - a.lastMsg.createdAt.seconds
        );

        listLoaded.value = true;

        if (formated.length > store.state.chat.chatsCount) {
          for (let i = 0; i < formated.length; i++) {
            store.commit("chat/addUniqChatSettingsItem", {
              id: formated[i].id,
              v: "",
              lastMsg: null,
              scrollPosition: null,
              limit: 0,
            });
          }
        }
      } else {
        console.log("No such document!");
      }
    });

    const chatContainer = ref(null);

    const auth = getAuth();

    async function sendMessageToFoundedChat(v, source) {
      const nextVerify = v.length > 0 || source;

      if (store.state.chat.selectedUser.uid && v.length < 2000 && nextVerify) {
        const userId1 = auth.currentUser.uid;
        const userId2 = store.state.chat.selectedUser.uid;

        const createNewChatid = userId1 + userId2;

        const user1Ref = db.collection("usersLinksToChat").doc(userId1);
        const user2Ref = db.collection("usersLinksToChat").doc(userId2);

        const chatId = userId1 + userId2;
        const enotherChatId = userId2 + userId1;

        const message = {
          userName: auth.currentUser.displayName
            ? auth.currentUser.displayName.slice(0, 25)
            : auth.currentUser.email.replace("@gmail.com", ""),
          userId: auth.currentUser.uid,
          text: v,
          createdAt: Timestamp.now(),

          // createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        };
        if (auth.currentUser.photoURL) {
          message.userPhotoURl = auth.currentUser.photoURL;
        }

        if (source) {
          message.source = source;
        }

        const chatsRef = db.collection("chatMessages");
        const chatDocRef = chatsRef.doc(enotherChatId);

        chatDocRef.get().then((doc) => {
          if (doc.exists) {
            console.log("Document exists 1");
            store.commit("chat/setChatId", enotherChatId);
            store.commit("chat/setSelectedUser", userId2);
          } else {
            const chatDocRefSecond = chatsRef.doc(chatId);

            chatDocRefSecond.get().then((doc) => {
              if (doc.exists) {
                console.log("Document exists 2");
                store.commit("chat/setChatId", chatId);
                store.commit("chat/setSelectedUser", userId2);
              } else {
                async function createChatWithFirstMessage() {
                  const db = firebase.firestore();
                  const batch = writeBatch(db);

                  // const chatRef = db.collection("chats").doc(chatId);

                  // const chatsMsgsRef = db
                  //   .collection("chatMessages")
                  //   .doc(chatId);

                  // batch.set(chatsMsgsRef, { messages: [message] });

                  const messagesRef = db
                    .collection("chatMessages")
                    .doc(chatId)
                    .collection("messages");
                  batch.set(messagesRef.doc(), message);

                  const lastMsg = {
                    text: v,
                    createdAt: message.createdAt,
                    from: message.userName,
                  };

                  // batch.set(chatRef, chatData);
                  // Step 1: Add the unique ID to the `chats` array in both users' documents.
                  batch.update(
                    user1Ref,
                    {
                      [chatId]: {
                        id: chatId,
                        lastMsg,
                      },
                    }
                    // chats: firebase.firestore.FieldValue.arrayUnion(chatData),
                  );

                  batch.update(user2Ref, {
                    // chats: firebase.firestore.FieldValue.arrayUnion(chatData),
                    [chatId]: {
                      id: chatId,
                      lastMsg,
                    },
                  });

                  // Step 2: Use the unique ID as the name of a new document in the `chats` collection.

                  // Wait for both update operations to complete before committing the batch.

                  await batch
                    .commit()
                    .then(() => {
                      console.log("Batch operation successful");
                      store.commit("chat/setChatId", chatId);
                      store.commit("chat/setSelectedUser", userId2);
                    })
                    .catch((error) => {
                      console.error("Batch operation failed:", error);
                    });
                }

                createChatWithFirstMessage();
              }
            });
          }
        });
      }
    }

    function resetSelectedChat() {
      store.commit("chat/setSelectedUser", null);
      store.commit("chat/setChatId", null);
    }

    function saveChatSettings(id, limit) {
      const scrollPosition = chatContainer?.value?.scrollTop;

      const settings = {
        limit,
        scrollPosition,
        id,
      };

      console.log(settings, "HERE");

      store.commit("chat/changeChatSettings", settings);
    }

    const chat = ref(null);
    const chatHided = ref(false);

    watchEffect(() => {
      if (store.state.chat.selectedUser?.new) {
        currentChatType.value = "NewChat";
      } else if (store.state.chat.chatId) {
        currentChatType.value = "AndTheRainWillKillAsAll";
      } else {
        currentChatType.value = "ChatisntSelected";
      }
    });

    const rer = ref(0);

    return {
      chat,
      chatList,
      chatHided,
      currentChatType,
      chatContainer,
      sendMessageToFoundedChat,
      resetSelectedChat,
      saveChatSettings,
      listLoaded,
      rer,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors";
$custom-c1: rgb(28, 28, 28);
$custom-c2: rgb(43, 43, 43);
$custom-c4: rgb(23, 23, 23);

$custom-c3: rgb(0, 128, 255);

.main {
  display: flex;
  justify-content: center;
  background-color: $custom-c2;
  background-color: #1c1c1c;
  background-image: linear-gradient(315deg, #2234ae 0%, #191714 74%);
  min-width: 100%;
  position: relative;
  height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  height: calc(var(--vh, 1vh) * 100);
}

.dark .main {
  background-color: #44b09e;
  background-image: linear-gradient(315deg, #44b09e 0%, #e0d2c7 74%);
}

.btn-controll {
  z-index: 10;
  bottom: 20px;
  right: 20px;

  position: absolute;
  transition: transform 0.1s ease-out;
  transform: translateY(100px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.chat-nav-x {
  position: relative;
  width: 100%;
  background-color: $content-main;
  height: 8%;
  text-align: left;

  display: flex;
  align-items: center;
  max-height: 75px;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */

  span {
    display: none;
    user-select: none; /* supported by Chrome and Opera */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    max-height: 90%;
  }

  @media (max-width: 798px) {
    span {
      color: #2b7cff;
      cursor: pointer;
      font-size: 1.8rem;
      display: block;
    }
  }

  h3 {
    font-weight: 500;
    font-size: 1.1rem;
    color: $text-main;
    position: absolute;
    left: 82px;
    top: 30%;
  }
}

.dark .chat-nav-x {
  background-color: $content-main-l;

  h3 {
    color: $text-main-l;
  }
}

.chat-container-x {
  height: 84%;
  max-width: 100%;
  overflow-y: scroll;
}

@media (min-width: 1400px) {
  .chat-container-x {
    max-width: 1400px;
    margin: 0% auto;
  }
}

.chat-container-x::-webkit-scrollbar {
  display: block;
  width: 5px;
}

.chat-container-x::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.107);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.123);
}

.chat-container-x::-webkit-scrollbar-thumb {
  background: rgba(152, 152, 152, 0.169);
  border-radius: 20px;
}

.chat-input-block-x {
  display: flex;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 8%;
  max-width: inherit;
  border-bottom: 1px solid $content-main;

  .dark {
    border-bottom: 1px solid $content-main-l;
  }

  .input-wrap {
    height: 100%;
    width: 100%;

    div {
      height: 100%;
    }
  }
}

@media (min-width: 1800px) {
  .chat-input-block-x {
    .input-wrap {
      max-width: 1400px;
    }
  }
}

.main {
  display: flex;
  justify-content: center;
  background-color: $custom-c2;

  min-width: 100%;
  position: relative;
  height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  height: calc(var(--vh, 1vh) * 100);
}

.left-bar {
  user-select: none; /* supported by Chrome and Opera */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  width: 310px;
  overflow: hidden;
  resize: horizontal;
  position: relative;
  flex-shrink: 0;
  background-color: $content-main;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(128, 128, 128, 0.237);

  .left_bar_srch-wrap {
    flex-shrink: 0;
    min-width: 100%;
    box-sizing: border-box;
    padding: 5px 13px 5px 5px;
    height: 8%;
    max-height: 60px;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: $content-main;

    input {
      background-color: $dark-input;
      height: 43px;
      width: 100%;
      padding-right: 5px;
      padding-left: 10px;
      margin-left: 5px;
      font-size: 0.9rem;
      color: $text-main;
      border-top-left-radius: 25px;
      border-bottom-left-radius: 25px;

      &::placeholder {
        color: #838383;
        font-size: 1rem;
        font-weight: 540;
      }
    }

    .left_bar_srch_wrap_settings {
      width: 43px;
      height: 43px;
      background-color: $hover;
      border-top-right-radius: 25px;
      border-bottom-right-radius: 25px;
      &:hover {
        color: rgb(146, 146, 146);
      }
      cursor: pointer;
      span {
        font-size: 1.2rem;
        margin: 0% auto;
        margin-right: 10px;
      }
    }

    .left_bar_srch_wrap_settings_active {
      width: 43px;
      color: $custom-c3;
      height: 43px;
      background-color: $hover;
      border-top-right-radius: 25px;
      border-bottom-right-radius: 25px;

      cursor: pointer;
      span {
        font-size: 1.2rem;
        margin: 0% auto;
        margin-right: 10px;
      }
    }
  }

  .chat-list {
    overflow-x: hidden;
  }

  .chat-list-hided {
    overflow-x: hidden;
  }

  .chat-list::-webkit-scrollbar {
    display: block;
    width: 5px;
  }

  .chat-list-wrap::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.648);
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }

  .chat-list-wrap::-webkit-scrollbar-thumb {
    background: rgba(152, 152, 152, 0.343);
    border-radius: 20px;
  }
}

.left-bar:hover {
  .btn-controll {
    transform: translateY(0px);
  }
}

.dark .left-bar .left_bar_srch-wrap {
  background-color: $content-main-l;

  input {
    color: $text-main-l;
  }
}
.dark .left-bar {
  background-color: $content-main-l;
}

.right-side {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow-y: hidden;
  background-color: $body-color;
}

.dark .right-side {
  background-color: #7ee8fa;
  background-image: linear-gradient(315deg, #7ee8fa 0%, #80ff72 74%);
}

.right-side-shoved-back {
  width: 100%;
  height: 100vh;
  background-color: $body-color;

  position: relative;
  overflow-y: hidden;
}
.dark .right-side-shoved-back {
  background-color: #7ee8fa;
  background-image: linear-gradient(315deg, #7ee8fa 0%, #80ff72 74%);
}

.chat-container {
  width: 100%;
  overflow-y: scroll;
  height: 100%;
  background-color: $custom-c4;
}

.chat-container::-webkit-scrollbar {
  width: 5px;
}

.chat-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.517);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

.chat-container::-webkit-scrollbar-thumb {
  background: rgba(152, 152, 152, 0.577);
  border-radius: 20px;
}

@media (max-width: 798px) {
  .right-side-shoved-back {
    transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
    width: 100%;
    position: absolute;
    height: 100vh;
    transform: translate(0%);
    overflow-x: hidden;
  }
  .right-side {
    width: 40%;
    overflow-x: hidden;
    transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
    height: 100vh;
    transform: translate(0%);

    .chat-container {
      .chat-nav {
        span {
          display: none;
          cursor: pointer;
        }
      }
    }
  }

  .left-bar {
    width: 60%;
    min-height: none;
    max-height: none;
    height: none;
    height: 100vh; /* Fallback for browsers that do not support Custom Properties */
    height: calc(var(--vh, 1vh) * 100);
    resize: none;

    .left_bar_srch-wrap {
      input {
        border-top-left-radius: 30px;
        border-bottom-left-radius: 30px;
        padding-left: 10px;
        height: 40px;
        font-size: 1.1rem;
      }

      .left_bar_srch_wrap_settings {
        border-top-right-radius: 30px;
        border-bottom-right-radius: 30px;
        display: flex;
        padding-right: 5px;
        justify-content: center;
        align-items: center;
        height: 40px;
        width: 40px;

        span {
          font-size: 1.2rem;
        }
      }
      .left_bar_srch_wrap_settings_active {
        border-top-right-radius: 30px;
        border-bottom-right-radius: 30px;
        display: flex;
        padding-right: 5px;
        justify-content: center;
        align-items: center;
        height: 40px;
        width: 40px;

        span {
          font-size: 1.2rem;
        }
      }
    }
  }
}

@media (max-width: 600px) {
  .chat-list-hided {
    display: none;
  }
  .right-side-shoved-back {
    width: 100%;
    min-height: 100%;
    position: fixed;
    z-index: 100;
    height: 100vh; /* Fallback for browsers that do not support Custom Properties */
    height: calc(var(--vh, 1vh) * 100);

    transform: translate(0%);
  }
  .right-side {
    width: 100%;
    z-index: 100;
    height: 100vh; /* Fallback for browsers that do not support Custom Properties */
    height: calc(var(--vh, 1vh) * 100);
    position: absolute;
    display: block;
    transform: translate(120%);

    .chat-container {
      .chat-nav {
        span {
          display: none;
          cursor: pointer;
        }
      }
    }
  }

  .left-bar {
    width: 100%;
    height: 100vh; /* Fallback for browsers that do not support Custom Properties */
    height: calc(var(--vh, 1vh) * 100);
    position: relative;
    resize: none;

    .left_bar_srch-wrap {
      input {
        border-top-left-radius: 25px;
        border-bottom-left-radius: 25px;
        height: 40px;
      }
    }
  }
}
</style>
