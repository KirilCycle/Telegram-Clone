<template>
  <div v-if="$store.state.chat.selectedUser" class="chat-nav">
    <p class="">
      {{ $store.state.chat.selectedUser.email }}
    </p>
  </div>
  <div class="main">
    <div class="chat-list">
      <p @click="isSearch = true">search chats</p>

      <div v-if="!isSearch" class="chat-list-container">
        <div
          @click="() => $store.commit('chat/setChatId', cht)"
          class="chatitem"
          v-for="cht in chatList.chats"
          :key="cht"
        >
          {{ cht }}
        </div>
      </div>

      <div v-else>
        <founded-chats-list></founded-chats-list>
      </div>
    </div>

    <div class="chat-container">
      <h2>selectedChat: {{ $store.state.chat.chatId }}</h2>

      <div v-if="$store.state.chat.chatId" class="chat-wrap">
        <!-- <div v-for="txt in chat.messages" :key="txt">{{txt}}</div> -->
        <direct-chat :chatId="$store.state.chat.chatId"></direct-chat>

        <input placeholder="enter test message" v-model="value" />
        <button @click="addNewMessag">SENNENENEND TEST</button>
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
import { collection, getDocs, getDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import store from "@/store/store";
import { ref } from "vue";
import { getDatabase, onValue } from "firebase/database";
import { updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import DirectChat from "@/components/DirectChat.vue";
import FoundedChatsList from "@/components/FoundedChatsList.vue";
import { getAuth } from "firebase/auth";

export default {
  components: {
    DirectChat,
    FoundedChatsList,
  },
  data() {
    return {
      isSearch: false,
      value: "",
    };
  },

  methods: {
    async addNewMessag() {
      const db = firebase.firestore();
      const washingtonRef = doc(db, "chats", store.state.chat.chatId);

      // Atomically add a new region to the "regions" array field.
      await updateDoc(washingtonRef, {
        messages: arrayUnion(this.value),
      });
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

    // Query the usersPrew collection
    // const query = db
    //   .collection("usersPrew")
    //   .where("email", ">=", "masterok")
    //   .where("email", "<=", "susz");

    // // Get the query results
    // query.get().then((querySnapshot) => {
    //   const users = [];
    //   querySnapshot.forEach((doc) => {
    //     // Get the document data and add it to the users array
    //     const user = doc.data();
    //     users.push(user);
    //   });
    //   console.log(users);
    // });

    collectionRef.doc(store.state.user.user.uid).onSnapshot((doc) => {
      if (doc.exists) {
        // Do something with the document data
        chatList.value = doc.data();

        console.log(chatList.value, "cht");
      } else {
        console.log("No such document!");
      }
    });

    // const chatRef = doc(db, "chats", data.selectedChatId);

    // //update
    // // To update age and favorite color:
    // updateDoc(frankDocRef, {
    //   "messages": arrayUnion("message test")
    // });

    const auth = getAuth();

    function sendMessageToFoundedChat(v) {
      if (auth.currentUser.uid && store.state.chat.selectedUser.uid) {
        const userId1 = auth.currentUser.uid;
        const userId2 = store.state.chat.selectedUser.uid;

        const createNewChatid = userId1 + userId2;

        if (!chatList.value.chats) {
          const db = firebase.firestore();
          const batch = db.batch();

          // Step 1: Add the unique ID to the `chats` array in both users' documents.
          const user1Ref = db.collection("usersLinksToChat").doc(userId1);

          const user2Ref = db.collection("usersLinksToChat").doc(userId2);

          const chatId = userId1 + userId2; // Replace this with your code to generate a unique ID.

          batch.update(user1Ref, {
            chats: firebase.firestore.FieldValue.arrayUnion(chatId),
          });

          batch.update(user2Ref, {
            chats: firebase.firestore.FieldValue.arrayUnion(chatId),
          });

          // Step 2: Use the unique ID as the name of a new document in the `chats` collection.
          const chatRef = db.collection("chats").doc(chatId);

          const chatData = {
            members: [userId1, userId2],
            messages: [v],
          };

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
        } else {
          if (
            chatList.value.chats.includes(createNewChatid) ||
            chatList.value.chats.includes(
              store.state.chat.selectedUser.uid + auth.currentUser.uid
            )
          ) {
            console.log("xuyna nashel  ");
          } else {
            const db = firebase.firestore();
            const batch = db.batch();

            // Step 1: Add the unique ID to the `chats` array in both users' documents.
            const user1Ref = db.collection("usersLinksToChat").doc(userId1);
            const user2Ref = db.collection("usersLinksToChat").doc(userId2);
            const chatId = userId1 + userId2; // Replace this with your code to generate a unique ID.

            batch.update(user1Ref, {
              chats: firebase.firestore.FieldValue.arrayUnion(chatId),
            });
            batch.update(user2Ref, {
              chats: firebase.firestore.FieldValue.arrayUnion(chatId),
            });

            // Step 2: Use the unique ID as the name of a new document in the `chats` collection.
            const chatRef = db.collection("chats").doc(chatId);
            const chatData = {
              members: [userId1, userId2],
              messages: [v],
            };

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

            console.log("net tatogo ", chatList.value);
          }
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
.chat-nav {
  color: white;
}
.main {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 70px;
}
.chat-list {
  width: 300px;
  height: 100vh;
  background-color: rgb(46, 46, 55);
  display: flex;
  flex-direction: column;
}
.chat-container {
  width: 100%;
  height: 100vh;
  background-color: #2a293f;
}
.chatitem {
  cursor: pointer;
  font-size: 1rem;
  color: #ffffff;
}
</style>
