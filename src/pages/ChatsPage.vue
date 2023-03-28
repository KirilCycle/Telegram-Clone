<template>
  <div class="main">
    <div class="chat-list">
      <div
        @click="() => $store.commit('chat/setChatId', cht)  "
        class="chatitem"
        v-for="cht in chatList.chats"
        :key="cht"
      >
        {{ cht }}
      </div>
    </div>
    <div class="chat-container">
      <h2>selectedChat: {{ $store.state.chat.chatId }}</h2>
     
      <div v-if="$store.state.chat.chatId" class="chat-wrap">
        <!-- <div v-for="txt in chat.messages" :key="txt">{{txt}}</div> -->
        <direct-chat :chatId="$store.state.chat.chatId"></direct-chat>
      </div>
     
      <div v-else>
        <h2>Select chat</h2>
      </div>
     
      <button @click="addNewMessag">SENNENENEND TEST</button>
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

export default {
  components: {
    DirectChat,
  },
  data() {
    return {
      
    };
  },

  methods: {
    async addNewMessag() {
      const db = firebase.firestore();
      const washingtonRef = doc(db, "chats", store.state.chat.chatId);

      // Atomically add a new region to the "regions" array field.
      await updateDoc(washingtonRef, {
        messages: arrayUnion("sex"),
      });
    },
  },
  setup(data) {
    const db = firebase.firestore();

    // const docRef = doc(db, "usersLinksToChat", "loVxhSxDf7dbHOJ6Sjmtdr1tyZ52");

    console.log(store.state.user.user.uid, "cht");

    const collectionRef = db.collection("usersLinksToChat");

    const chatList = ref("");

    const chat =ref("")


    const slectedChatRef = db.collection("chats")

if (store.state.chat.chatId) {

  slectedChatRef.doc( store.state.chat.chatId).onSnapshot((doc) => {
    if (doc.exists) {
      // Do something with the document data
      chat.value = doc.data();
  
      console.log(chat.value, "cht but isnt list juct cht");
    } else {
      console.log("No such document!");
    }
  })
}



// Query the usersPrew collection
const query = db.collection('usersPrew').where('email', '>=', 'masterok').where('email', '<=', 'susz');

// Get the query results
query.get().then((querySnapshot) => {
  const users = [];
  querySnapshot.forEach((doc) => {
    // Get the document data and add it to the users array
    const user = doc.data();
    users.push(user);
  });
  console.log(users);
});






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

    return {
      chatList,
      chat,
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
