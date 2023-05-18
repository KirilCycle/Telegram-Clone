<template>
  <message-actions v-if="$store.state.message.visible"></message-actions>

  <div class="main">
    <div class="left-bar">
      <div class="btn-controll">
        <chats-control-btn></chats-control-btn>
      </div>

      <div class="left_bar_srch-wrap" placeholder="search chat">
        <settings></settings>

        <div class="search-input-container">
          <div class="magnifying-glass-wrap">
            <div class="magnifying-glass"></div>
          </div>

          <input
            class="search-chats-input"
            placeholder="Search"
            :value="serachQ"
            @input="(e) => serachChat(e.target.value)"
          />

          <button
            @click="resetQuerry"
            v-show="querryExist"
            class="reset-search-btn"
          >
            <span class="material-symbols-outlined"> close </span>
          </button>
        </div>

        <!-- <button
          @click="isSearch = !isSearch"
          :class="{
            left_bar_srch_wrap_settings: !isSearch,
            left_bar_srch_wrap_settings_active: isSearch,
          }"
        >
          <span class="material-symbols-outlined"> language </span>
        </button> -->
      </div>

      <div @click="chatHided = true" v-show="!isGlobalSearch" class="chat-list">
        <chat-list :storePath="'chat'" :chatList="chatList"></chat-list>
      </div>

      <div v-if="isGlobalSearch" @click="chatHided = true">
        <founded-chats-list></founded-chats-list>
      </div>
    </div>

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
          :is="currentChatType"
          :key="$store.state.chat.chatKey"
          :parentRef="$refs.chatContainer"
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
  </div>
</template>

<script>
import { collection, getDocs, getDoc, Timestamp } from "firebase/firestore";
import firebase from "firebase/compat/app";
import store from "@/store/store";
import { onMounted, ref } from "vue";
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
import ParentChat from "@/components/chat/ParentChat.vue";
import Vue from "vue";
import { computed, reactive } from "vue";
import { useStore } from "vuex";
import MetalKiller from "@/components/chat/MetalKiller.vue";

export default {
  components: {
    DirectChat,
    MetalKiller,
    ParentChat,
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
      isGlobalSearch: false,
      value: "",
      chatKey: "s",
      serachQ: "",
      parentChatRef: this.$refs.chatContainer,
    };
  },
  mounted() {
    this.$store.commit("chat/setChatContainerRef", this.$refs.chatContainer);
  },
  methods: {
    update(changeId) {
      if (changeId !== this.chatKey) {
        console.log("UPDATED");
        this.chatKey = changeId;
      }
    },
    resetQuerry() {
      store.commit("chat/setQuery", null);
      this.serachQ = null;
        this.isGlobalSearch = false;
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
      query
        ? store.commit("chat/setQuery", query)
        : store.commit("chat/setQuery", null);
      this.serachQ = query;
      if (query.replaceAll(" ", "")[0] === "@") {
        this.isGlobalSearch = true;
      } else {
        this.isGlobalSearch = false;
      }
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
    querryExist() {
      if (this.serachQ) {
        return true;
      }
      return false;
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
        currentChatType.value = "MetalKiller";
        //MetalKiller
      } else {
        currentChatType.value = "ChatisntSelected";
      }
    });

    const rer = ref(0);

    const chatContainer = ref(null);

    return {
      chat,
      chatList,
      chatContainer,
      chatHided,
      currentChatType,
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
  height: 78%;
  width: 70%;
  margin: 0% auto;
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
  width: 7px;
}

.chat-container-x::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
}

.chat-container-x::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.603);
  border-radius: 20px;
}

.chat-input-block-x {
  position: relative;
  width: 100%;
  height: 8%;
  padding-top: 4px;
  max-width: inherit;

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
  width: 400px;
  overflow: hidden;
  resize: horizontal;
  position: relative;
  flex-shrink: 0;
  background-color: $content-main;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(128, 128, 128, 0.237);

  .search-input-container {
    display: flex;
    flex-direction: row;
    position: relative;
    width: 100%;

    .magnifying-glass-wrap {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 60px;
      height: 100%;
    }

    .reset-search-btn {
      cursor: pointer;
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 60px;
      height: 100%;
      right: 0px;
      &:hover {
        color: $second;
      }
    }
  }

  .magnifying-glass {
    flex-shrink: 0;
    font-size: 4em; /* Adjusted font-size to make it smaller */
    display: inline-block;
    width: 0.15em; /* Adjusted width to make it smaller */
    box-sizing: content-box;
    height: 0.15em; /* Adjusted height to make it smaller */
    border: 0.04em solid $second-content; /* Adjusted border width to make it smaller */
    position: relative;
    border-radius: 0.125em; /* Adjusted border-radius to make it smaller */
  }

  .magnifying-glass:before {
    content: "";
    display: inline-block;
    position: absolute;
    right: -0.09em; /* Adjusted position to make it smaller */
    bottom: -0.03em; /* Adjusted position to make it smaller */
    border-width: 0;
    background: $second-content;
    width: 0.125em; /* Adjusted width to make it smaller */
    height: 0.03em; /* Adjusted height to make it smaller */
    transform: rotate(45deg);
  }

  .magnifying-glass-active {
    @extend .magnifying-glass;
    border: 0.04em solid $second;
  }

  .magnifying-glass-active:before {
    content: "";
    display: inline-block;
    position: absolute;
    right: -0.09em; /* Adjusted position to make it smaller */
    bottom: -0.03em; /* Adjusted position to make it smaller */
    border-width: 0;
    background: $second;
    width: 0.125em; /* Adjusted width to make it smaller */
    height: 0.03em; /* Adjusted height to make it smaller */
    transform: rotate(45deg);
  }

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

    .search-chats-input {
      background-color: $dark-input;
      height: 41px;
      width: 100%;
      padding-right: 5px;
      transition: border-color 0.6s ease;
      transition: box-shadow 0.4s ease;
      padding-left: 45px;
      padding-right: 45px;
      margin-left: 5px;
      font-size: 0.9rem;
      border-radius: 25px;
      color: $text-main;
      border: 1px solid rgb(51, 51, 51);

      &:hover {
        border: 1px solid rgb(102, 102, 102);
        transition: border-color 0.6s ease-out;
      }
      &:focus {
        box-shadow: inset 0px 1px 2px $second, inset 0px 0px 0px 2px $second;
        border: 1px solid $dark-input;
      }

      &::placeholder {
        color: #838383;
        font-size: 1rem;
        font-weight: 540;
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
  .search-chats-input {
    background-color: $light-input;
    border: 1px solid rgb(232, 232, 232);
    &:hover {
      border: 1px solid rgb(180, 180, 180);
    }

    &:focus {
      box-shadow: inset 0px 1px 2px $second, inset 0px 0px 0px 2px $second;
      border: 1px solid white;
    }
  }

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
  }

  .left-bar {
    width: 60%;
    min-height: none;
    max-height: none;
    height: none;
    height: 100vh; /* Fallback for browsers that do not support Custom Properties */
    height: calc(var(--vh, 1vh) * 100);
    resize: none;
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
  }

  .left-bar {
    width: 100%;
    height: 100vh; /* Fallback for browsers that do not support Custom Properties */
    height: calc(var(--vh, 1vh) * 100);
    position: relative;
    resize: none;

    .left_bar_srch-wrap {
      .search-chats-input {
        height: 43px;
      }
    }
  }
}
</style>
