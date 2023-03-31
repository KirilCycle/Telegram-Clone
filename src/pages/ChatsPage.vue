<template>
  <div class="main">
    <div class="left-bar">
      <div class="left_bar_srch-wrap" placeholder="search chat">
        <button class="menu-btn-wrap">
          <button class="menu-btn">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </button>
        <input
          placeholder="Search"
          @input="(e) => serachChat(e.target.value)"
        />
        <button
          @click="isSearch = !isSearch"
          class="left_bar_srch_wrap_settings"
        >
          <span class="material-symbols-outlined"> language </span>
        </button>
      </div>
      <div v-if="!isSearch" class="chat-list">
        <chat-list :serachQ="serachQ" :chatList="chatList"></chat-list>
      </div>
      <div v-else>
        <founded-chats-list></founded-chats-list>
      </div>
    </div>

    <div class="right-side">
      <div class="chat-container">
        <nav class="chat-nav">
          <h3>{{ $store.state.chat.selectedUser?.email }}</h3>
        </nav>

        <div v-if="$store.state.chat.chatId">
          <div class="chat-wrap">
            <direct-chat :sendMsg="addNewMessage"></direct-chat>
          </div>
        </div>

        <!-- <chat-input :sendMsg="addNewMessage"></chat-input> -->

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
      </div>
    </div>
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

export default {
  components: {
    DirectChat,
    FoundedChatsList,
    ChatList,
    ChatInput,
  },
  data() {
    return {
      isSearch: false,
      value: "",
      serachQ: "",
    };
  },

  methods: {
    async addNewMessage(text) {
      const db = firebase.firestore();
      const chatRef = doc(db, "chats", store.state.chat.chatId);
      const auth = getAuth();

      if (auth.currentUser && text.length < 2000 && text.length > 0) {
        const message = {
          userName: auth.currentUser.displayName
            ? auth.currentUser.displayName.slice(0, 25)
            : auth.currentUser.email,
          userId: auth.currentUser.uid,
          text,
          createdAt: Timestamp.now(),
          id: uuidv4() + auth.currentUser.uid.replaceAll(" ", ""),
          // createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        };
        if (auth.currentUser.photoURL) {
          message.userPhotoURl = auth.currentUser.photoURL;
        }

        await updateDoc(chatRef, {
          messages: arrayUnion(message),
          lastMessage: text,
        });
      }
    },

    serachChat(querry) {
      querry.length > 0
        ? store.commit("chat/setQuerry", querry)
        : store.commit("chat/setQuerry", null);
    },
  },
  setup(data) {
    const db = firebase.firestore();

    // const docRef = doc(db, "usersLinksToChat", "loVxhSxDf7dbHOJ6Sjmtdr1tyZ52");

    console.log(store.state.user.user.uid, "cht");

    const collectionRef = db.collection("usersLinksToChat");

    const chatList = ref("");

    const chat = ref("");

    const slectedChatRef = db.collection("chats");

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
        // Do something with the document data
        store.commit("chat/setChatIdList", doc.data());
        chatList.value = doc.data();

        console.log(chatList.value, "cht");
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
            : auth.currentUser.email,
          userId: auth.currentUser.uid,
          text: v,
          createdAt: Timestamp.now(),
          id: uuidv4() + auth.currentUser.uid.replaceAll(" ", ""),
          // createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        };
        if (auth.currentUser.photoURL) {
          message.userPhotoURl = auth.currentUser.photoURL;
        }

        const chatData = {
          lastMessage: message.text,
          members: [userId1, userId2],
          messages: [message],
        };

        const chatsRef = db.collection("chats");
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

                  const chatRef = db.collection("chats").doc(chatId);
                  batch.set(chatRef, chatData);
                  // Step 1: Add the unique ID to the `chats` array in both users' documents.
                  batch.update(user1Ref, {
                    chats: firebase.firestore.FieldValue.arrayUnion(chatId),
                  });

                  batch.update(user2Ref, {
                    chats: firebase.firestore.FieldValue.arrayUnion(chatId),
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

    return {
      chatList,
      chat,
      sendMessageToFoundedChat,
    };
  },
};
</script>

<style lang="scss" scoped>
$custom-c1: rgb(20, 20, 20);
$custom-c2: rgb(32, 32, 32);
$custom-c4: rgb(23, 23, 23);
$custom-c3: rgb(0, 128, 255);

.main {
  display: flex;
  justify-content: center;
  overflow: hidden;
  width: 100%;
  height: 100vh;
}
.left-bar {
  min-width: 300px;
  flex-shrink: 0;
  background-color: $custom-c1;
  display: flex;
  min-height: 100%;
  max-height: 100%;
  flex-direction: column;

  .left_bar_srch-wrap {
    flex-shrink: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 5px;
    height: 10%;
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
        height: 20px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        span {
          width: 65%;
          height: 2px;
          background-color: #8b8b8b;
        }
      }
    }

    input {
      background-color: $custom-c2;
      height: 35px;
      width: 210px;
      padding-right: 5px;
      margin-left: 5px;
      font-size: 0.9rem;
      color: #e7e7e7;
      padding-left: 3px;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
    }

    .left_bar_srch_wrap_settings {
      width: 35px;
      height: 35px;
      background-color: $custom-c2;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      &:hover {
        color: rgb(146, 146, 146);
      }
      cursor: pointer;
      span {
        font-size: 1.2rem;
        margin: 0% auto;
      }
    }
  }
  .chat-list {
    
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 95vh;
    max-height: 95vh;
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
    background: rgba(152, 152, 152, 0.577);
    border-radius: 20px;
  }
}

.right-side {
  width: 100%;
  height: 100%;
  background-color: #0f0f0f;
}

.chat-container {
  width: 100%;
  overflow-y: scroll;
  height: 100%;
  background-color: $custom-c4;
  .chat-nav {
    position: fixed;
    top: 0px;
    flex-shrink: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 5px;
    z-index: 100;
    height: 7%;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: $custom-c2;
    font-size: 0.9rem;
    color: #e2e2e2;

    .chat-wrap {
      width: 100%;
      overflow-y: scroll;
      height: 80vh;
    }
  }
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
</style>
