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
          :class="{
            left_bar_srch_wrap_global_search: isSearch,
            left_bar_srch_wrap_local_search: !isSearch,
          }"
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

    <div class="chat-container">
      <div v-if="$store.state.chat.chatId" class="chat-wrap">
        <nav class="chat-nav">
          <h3>{{ chatName }}</h3>
        </nav>
        <!-- <div v-for="txt in chat.messages" :key="txt">{{txt}}</div> -->
        <direct-chat></direct-chat>

        <input placeholder="enter test message" v-model="value" />
        <button @click="addNewMessage">SENNENENEND TEST</button>
      </div>

      <div v-if="!$store.state.chat.chatId && !$store.state.chat.selectedUser">
        <h2>Select chat</h2>
      </div>

      <div v-if="$store.state.chat.selectedUser">
        <h2>Target chat</h2>
        <input v-model="value" />
        <button @click="() => sendMessageToFoundedChat(value)">
          enter target mes
        </button>
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
import { doc, setDoc } from "firebase/firestore";
import DirectChat from "@/components/DirectChat.vue";
import FoundedChatsList from "@/components/FoundedChatsList.vue";
import { getAuth } from "firebase/auth";
import { uuidv4 } from "@firebase/util";
import ChatList from "@/components/ChatList.vue";

export default {
  components: {
    DirectChat,
    FoundedChatsList,
    ChatList,
  },
  data() {
    return {
      isSearch: false,
      value: "",
      serachQ: "",
    };
  },

  methods: {
    async addNewMessage() {
      const db = firebase.firestore();
      const chatRef = doc(db, "chats", store.state.chat.chatId);
      const auth = getAuth();

      if (
        auth.currentUser &&
        this.value.length < 2000 &&
        this.value.length > 0
      ) {
        const message = {
          userName: auth.currentUser.displayName
            ? auth.currentUser.displayName.slice(0, 25)
            : auth.currentUser.email,
          userId: auth.currentUser.uid,
          text: this.value,
          createdAt: Timestamp.now(),
          id: uuidv4() + auth.currentUser.uid.replaceAll(" ", ""),
          // createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        };
        if (auth.currentUser.photoURL) {
          message.userPhotoURl = auth.currentUser.photoURL;
        }

        await updateDoc(chatRef, {
          messages: arrayUnion(message),
          lastMessage: this.value,
        });
      }

      // Atomically add a new region to the "regions" array field.
    },

    serachChat(querry) {
      querry.length > 0
        ? store.commit("chat/setQuerry", querry)
        : store.commit("chat/setQuerry", null);
    },
  },
  computed: {
    chatName() {
      if (store.state.chat.selectedUser?.displayName) {
        return store.state.chat.selectedUser.displayName;
      }
      return store.state.chat.selectedUser.email?.replace("@gmail.com", "");
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
        console.log(doc.data(), "MAIN CHATS");
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

        try {
          const chatsRef = db.collection("chats");
          const chatDocRef = chatsRef.doc(userId2 + userId1 );

          chatDocRef.get().then((doc) => {
            if (doc.exists) {
              console.log("Document exists 1");
            } else {

              const chatDocRefSec = chatsRef.doc(chatId)

              chatDocRefSec.get().then((doc) => {
            if (doc.exists) {
              console.log("Document exists 2");
            } else {
             

              const db = firebase.firestore();
                const batch = db.batch();

                // Step 1: Add the unique ID to the `chats` array in both users' documents.

                batch.update(user1Ref, {
                  chats: firebase.firestore.FieldValue.arrayUnion(chatId),
                });
                batch.update(user2Ref, {
                  chats: firebase.firestore.FieldValue.arrayUnion(chatId),
                });

                // Step 2: Use the unique ID as the name of a new document in the `chats` collection.
                const chatRef = db.collection("chats").doc(chatId);

                batch.set(chatRef, chatData);

                // Commit the batch operation.
                batch
                  .commit()
                  .then(() => {
                    console.log("Batch operation successful");
                  })
                  .catch((error) => {
                    console.error("Batch operation failed:", error);
                  });
              }



            
            })
          
          }
          
          });

          // const res = await getDoc(doc, db, "chats", createNewChatid);

          // if (!res.exists()) {
          //   //first verify
          //   const resSecond = await getDoc(
          //     doc,
          //     db,
          //     "chats",
          //     store.state.chat.selectedUser.uid + auth.currentUser.uid
          //   ).then((res) => {
          //     if (!resSecond.exists()) {
          //       const db = firebase.firestore();
          //       const batch = db.batch();

          //       // Step 1: Add the unique ID to the `chats` array in both users' documents.

          //       batch.update(user1Ref, {
          //         chats: firebase.firestore.FieldValue.arrayUnion(chatId),
          //       });
          //       batch.update(user2Ref, {
          //         chats: firebase.firestore.FieldValue.arrayUnion(chatId),
          //       });

          //       // Step 2: Use the unique ID as the name of a new document in the `chats` collection.
          //       const chatRef = db.collection("chats").doc(chatId);

          //       batch.set(chatRef, chatData);

          //       // Commit the batch operation.
          //       batch
          //         .commit()
          //         .then(() => {
          //           console.log("Batch operation successful");
          //         })
          //         .catch((error) => {
          //           console.error("Batch operation failed:", error);
          //         });
          //     }

          //   })

          // }
        } catch (e) {
          console.log(e, "case 1");
        }
      }
    }

    return {
      chatList,
      chat,
      sendMessageToFoundedChat,
    };

    // let query = db.collection("usersLinksToChat",'loVxhSxDf7dbHOJ6Sjmtdr1tyZ52')

    // const unsubscribe = docSnap.onSnapshot((snapshot, parameters) => {
    //   chatList.value = snapshot.docs
    //     .map((doc) => ({ id: doc.id, ...doc.data() }))
    //     .reverse();
    //   console.log(chatList.value, "docs");
  },
};
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  justify-content: center;
}
.left-bar {
  width: 350px;
  background-color: rgb(46, 46, 55);
  display: flex;
  min-height: 100vh;
  max-height: 100vh;
  flex-direction: column;

  .left_bar_srch-wrap {
    flex-shrink: 0;
    width: 100%;
    padding: 5px;
    box-sizing: border-box;
    height: 10vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #1d1e2a;

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
        height: 15px;
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
      background-color: rgb(46, 46, 55);
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

    .left_bar_srch_wrap_local_search {
      width: 35px;
      height: 35px;
      background-color: rgb(46, 46, 55);
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

    .left_bar_srch_wrap_global_search {
      color: rgb(21, 255, 56);
      @extend .left_bar_srch_wrap_local_search;
      &:hover {
        color: rgb(21, 255, 56);
      }
    }
  }
  .chat-list {
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 95vh;
    max-height: 95vh;
  }
}
.chat-container {
  min-height: 100vh;
  max-height: 100vh;
  width: 100%;
  background-color: #939393;

  .chat-wrap {
    height: 100%;

    .chat-nav {
      width: 100%;
      padding: 5px;
      box-sizing: border-box;
      height: 10vh;
      display: flex;
      flex-direction: row;
      align-items: center;
      background-color: #1d1e2a;
    }
  }
}
.chatitem {
  cursor: pointer;
  font-size: 1rem;
  color: #ffffff;
}
</style>
