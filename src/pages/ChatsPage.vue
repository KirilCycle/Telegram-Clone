<template>
  <div v-if="$store.state.chat.selectedUser" class="chat-nav">
    <p class="">
      {{ $store.state.chat.selectedUser.email }}
    </p>
  </div>
  <div class="main">
    <div class="left-bar">
      <div class="left_bar_srch-wrap" placeholder="search chat"> 
        <button>

        </button>
        <input placeholder="search chat" @input="(e) => serachChat(e.target.value)"/>
      </div>


      <div v-if="!isSearch" class="chat-list">
       
         <chat-list  :serachQ="serachQ" :chatList="chatList" ></chat-list>
        
      </div>


      <div v-else>
        <founded-chats-list></founded-chats-list>
      </div>
    </div>

    <div class="chat-container">
      <h2>selectedChat: {{ $store.state.chat.chatId }}</h2>

      <div v-if="$store.state.chat.chatId" class="chat-wrap">
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
import ChatList from '@/components/ChatList.vue';

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
      serachQ: ''
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
          lastMessage: this.value
        });
      }

      // Atomically add a new region to the "regions" array field.
    },

    serachChat (querry) {
     
     querry.length > 0 ?store.commit('chat/setQuerry', querry):store.commit('chat/setQuerry', null)



    }
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
        chatList.value = doc.data();

        console.log(chatList.value, "cht");
      } else {
        console.log("No such document!");
      }
    });

    const auth = getAuth();

    function sendMessageToFoundedChat(v) {
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




        if (!chatList.value.chats) {
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
        } else {
          if (
            chatList.value.chats.includes(createNewChatid) ||
            chatList.value.chats.includes(
              store.state.chat.selectedUser.uid + auth.currentUser.uid
            )
          ) {


            console.log("xuyna nashel");
            
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

}
.left-bar {
  width: 300px;

  background-color: rgb(46, 46, 55);
  display: flex;
  flex-direction: column;
  .chat-list {
    overflow-y: auto;   
    overflow-x:hidden ;
    min-height: 90vh; 
    max-height: 90vh; 
  }
}
.chat-container {
  
  min-height: 90vh; 
  max-height: 90vh;
  width: 100%;
  background-color: #939393;
}
.chatitem {
  cursor: pointer;
  font-size: 1rem;
  color: #ffffff;
}
</style>
