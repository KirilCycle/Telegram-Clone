<template>
  <message-actions v-if="$store.state.message.visible"></message-actions>

  <!-- <button class="test" @click="test"></button> -->

  <div class="main">
    <div class="left-bar">
      <div class="left_bar_srch-wrap" placeholder="search chat">
       
        <!-- <button class="menu-btn-wrap">
          <button class="menu-btn">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </button> -->
       
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
        <chat-list :serachQ="serachQ" :chatList="chatList"></chat-list>
      </div>

      <div v-if="isSearch" @click="chatHided = true">
        <founded-chats-list></founded-chats-list>
      </div>
    </div>

    <Transition>
      <div
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
        </div>

        <div class="chat-container-x">
          <component :is="currentChatType"> </component>
        </div>

        <div
          v-if="$store.state.chat.chatId || $store.state.chat.selectedUser"
          class="chat-input-block-x"
        >
          <div class="input-wrap">
            <div v-if="$store.state.chat.selectedUser.new">
              <chat-input :sendMsg="sendMessageToFoundedChat"></chat-input>
            </div>

            <div v-else>
              <chat-input :sendMsg="addNewMessage"></chat-input>
            </div>
          </div>
        </div>

        <!-- <div class="chat-container"> -->
        <!-- <nav class="chat-nav">
          <span class="material-symbols-outlined"> chevron_left </span>
          <h3>{{ $store.state.chat.selectedUser?.email }}</h3>
        </nav>

        <div v-if="$store.state.chat.chatId">
          <div class="chat-wrap">
            <direct-chat :sendMsg="addNewMessage"></direct-chat>
          </div>
        </div>

        <chat-input :sendMsg="addNewMessage"></chat-input>

        <div
          v-if="!$store.state.chat.chatId && !$store.state.chat.selectedUser"
        >
          <h2>Select chat</h2>
        </div>

        <div class="target-chat" v-if="$store.state.chat.selectedUser?.new">
          <h2>
            Target chat
            xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          </h2>

          <chat-input :sendMsg="sendMessageToFoundedChat"></chat-input>
        </div>
      </div> -->
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

export default {
  components: {
    DirectChat,
    ReplyMessageBorder,
    NewChat,
    ChatisntSelected,
    FoundedChatsList,
    ChatList,
    Settings,
    ChatInput,
    SelectedChatNav,
    MessageActions,
  },
  data() {
    return {
      isSearch: false,
      value: "",
      serachQ: "",
      chatHided: false,
    };
  },

  watch: {
    chatStore() {
      console.log("watch AAAACCCC");
      if (store.state.chat.selectedUser?.new) {
        this.currentChatType = "NewChat";
      } else if (store.state.state.chat.chatId) {
        this.currentChatType = "DirectChat";
      }
      this.currentChatType = "ChatisntSelected";
    },
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

  methods: {
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

    async addNewMessage(text, img, replyData) {
      const db = firebase.firestore();
      const chatRefMsg = doc(db, "chatMessages", store.state.chat.chatId);

      const auth = getAuth();

      if (auth.currentUser && text.length < 2000 && text.length > 0) {
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

        if (img) {
          //   messageisNotReady.value = true;
          message.imageRef = img;
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

    serachChat(querry) {
      querry.length > 0
        ? store.commit("chat/setQuerry", querry.toLowerCase())
        : store.commit("chat/setQuerry", null);
    },
  },

  computed: {
    navName() {
      console.log("perecomput");
      const user = store.state.chat.selectedUser;

      console.log(user);

      if (user) {
        if (user?.displayName) {
          return user.displayName;
        } else {
          return user.email.slice(0, user.email.indexOf("@"));
        }
      }
    },
  },
  setup(data) {
    const db = firebase.firestore();

    // const docRef = doc(db, "usersLinksToChat", "loVxhSxDf7dbHOJ6Sjmtdr1tyZ52");

    console.log(store.state.user.user.uid, "cht");

    const collectionRef = db.collection("usersLinksToChat");

    const chatList = ref("");

    const chat = ref("");

    const slectedChatRef = db.collection("usersLinksToChat");

    if (store.state.chat.chatId) {
      slectedChatRef.doc(store.state.chat.chatId).onSnapshot((doc) => {
        if (doc.exists) {
          // Do something with the document data
          chat.value = doc.data();

          console.log(chat.value, "cht but isnt list juct cht");
        } else {
          console.log("No such document!");
        }
      });
    }

    // });

    collectionRef.doc(store.state.user.user.uid).onSnapshot((doc) => {
      if (doc.exists) {
        const formated = Object.values(doc.data());
        // Do something with the document data
        store.commit("chat/setChatIdList", formated);
        chatList.value = formated.sort(
          (a, b) => b.lastMsg.createdAt.seconds - a.lastMsg.createdAt.seconds
        );

        console.log(formated, doc.data(), "AS MAIN FETCH CHATS");
      } else {
        console.log("No such document!");
      }
    });

    const auth = getAuth();

    async function sendMessageToFoundedChat(v) {
      if (auth.currentUser.uid && store.state.chat.selectedUser.uid) {
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

        const chatData = {
          lastMessage: { text: message.text, createdAt: message.createdAt },
          uid: chatId,
        };

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
                  // const chatsMsgsRef = db
                  //   .collection("chatMessages")
                  //   .doc(store.state.chat.chatId);
                  // batch.set(chatsMsgsRef);
                  // const messageRef = chatsMsgsRef.collection("messages");
                  // const newMessageRef = messageRef.doc("1221321313customid");
                  // batch.set(newMessageRef, message);

                  const messagesRef = db
                    .collection("chatMessages")
                    .doc(store.state.chat.chatId)
                    .collection("messagessXXXXXX");
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

    const currentChatType = ref("ChatisntSelected");

    watchEffect(() => {
      if (store.state.chat.selectedUser?.new) {
        currentChatType.value = "NewChat";
      } else if (store.state.chat.chatId) {
        currentChatType.value = "DirectChat";
      } else {
        currentChatType.value = "ChatisntSelected";
      }
    });

    return {
      chatList,
      currentChatType,
      chat,
      sendMessageToFoundedChat,
      resetSelectedChat,
    };
  },
};
</script>

<style lang="scss" scoped>
$custom-c1: rgb(28, 28, 28);
$custom-c2: rgb(43, 43, 43);
$custom-c4: rgb(23, 23, 23);
$custom-c3: rgb(0, 128, 255);

.test {
  width: 500px;
  height: 500px;
  z-index: 300;
  position: absolute;
  background-color: #e40f0f;
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
  background-color: $custom-c4;
  height: 10%;
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
    color: white;
    position: absolute;
    left: 82px;
    top: 30%;
  }
}

.chat-container-x {
  height: 82%;
  max-width: 100%;
  background-color: $custom-c2;
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

  .input-wrap {
    height: 100%;
    width: 100%;

    div {
      height: 100%;
    }
  }
}

@media (min-width: 1400px) {
  .chat-input-block-x {
    max-width: 1400px;
    margin: 0% auto;

    border-top: 1px solid rgba(101, 101, 101, 0.667);
  }
}

.chat-input-block-x {
  .input-wrap {
    max-width: 1400px;
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
  width: 290px;
  overflow: hidden;
  resize: horizontal;
  flex-shrink: 0;
  background-color: $custom-c1;
  display: flex;
  flex-direction: column;

  .left_bar_srch-wrap {
    flex-shrink: 0;
    min-width: 100%;
    box-sizing: border-box;
    padding: 5px;
    height: 10%;
    max-height: 75px;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: $custom-c1;

    .menu-btn-wrap {
      cursor: pointer;
      border-radius: 5px;
      width: 35px;
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        background-color: #4040406b;
      }
      .menu-btn {
        width: 35px;
        height: 10px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        span {
          width: 45%;
          height: 2px;
          background-color: #8b8b8b;
        }
      }
    }

    input {
      background-color: $custom-c2;
      height: 43px;
      width: 90%;
      padding-right: 5px;
      padding-left: 10px;
      margin-left: 5px;
      font-size: 0.9rem;
      color: #e7e7e7;
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
      background-color: $custom-c2;
      border-top-right-radius: 25px;
      border-bottom-right-radius: 25px;
      &:hover {
        color: rgb(146, 146, 146);
      }
      cursor: pointer;
      span {
        font-size: 1.2rem;
        margin: 0% auto;
      }
    }

    .left_bar_srch_wrap_settings_active {
      width: 43px;
      color: $custom-c3;
      height: 43px;
      background-color: $custom-c2;
      border-top-right-radius: 25px;
      border-bottom-right-radius: 25px;
      &:hover {
      }
      cursor: pointer;
      span {
        font-size: 1.2rem;
        margin: 0% auto;
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

.right-side {
  width: 100%;
  height: 100vh;
  position: relative;
  background-color: #1e1e1e;
  overflow-y: hidden;
}

.right-side-shoved-back {
  width: 100%;
  position: relative;
  background-color: #1e1e1e;
  overflow-y: hidden;
  height: 100vh;
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
.chatitem {
  cursor: pointer;
  font-size: 1rem;
  color: #ffffff;
}

@media (max-width: 798px) {
  .right-side-shoved-back {
    width: 100%;
    position: absolute;
    height: 100vh;
    transform: translate(0%);
    overflow-x: hidden;
  }
  .right-side {
    width: 40%;
    overflow-x: hidden;
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
    position: relative;
    resize: none;
    background-color: rgb(11, 11, 11);

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
        transform: translate(-3px);

        span {
          font-size: 1.6rem;
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
          font-size: 1.6rem;
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
    position: absolute;
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
    display: none;
    transform: translate(-120%);

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
    background-color: #090909;

    .left_bar_srch-wrap {
      input {
        border-top-left-radius: 25px;
        border-bottom-left-radius: 25px;
        height: 40px;
      }
    }
  }
}

@media (max-width: 925px) {
  .chat-nav-x {
    color: #e40f0f;
  }
}
</style>
