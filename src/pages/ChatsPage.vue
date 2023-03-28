<template>
  <div>SUS
    <div class="chatitem" v-for="cht in chatList.chats" :key="cht">
      {{cht }}
    </div>
  </div>
</template>

<script>
import { collection, getDocs, getDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import store from "@/store/store";
import { ref } from 'vue'
import { getDatabase, onValue } from "firebase/database";
import { doc, setDoc } from "firebase/firestore";

export default {
  data() {},
  setup() {
    const db = firebase.firestore();

    // const docRef = doc(db, "usersLinksToChat", "loVxhSxDf7dbHOJ6Sjmtdr1tyZ52");

    console.log(store.state.user.user.uid, 'cht')

    const collectionRef = db.collection("usersLinksToChat");

     const chatList = ref("");

    collectionRef.doc(store.state.user.user.uid).onSnapshot((doc) => {
      if (doc.exists) {
        // Do something with the document data
        chatList.value = doc.data()

        console.log(chatList.value, 'cht')
      } else {
        console.log("No such document!");
      }
    });
    return {
      chatList
    }

    // let query = db.collection("usersLinksToChat",'loVxhSxDf7dbHOJ6Sjmtdr1tyZ52')

    // const unsubscribe = docSnap.onSnapshot((snapshot, parameters) => {
    //   chatList.value = snapshot.docs
    //     .map((doc) => ({ id: doc.id, ...doc.data() }))
    //     .reverse();
    //   console.log(chatList.value, "docs");
    // });

    //   setDoc(doc(db, "usersLinksToChat", "loVxhSxDf7dbHOJ6Sjmtdr1tyZ52"),
    //  {
    //   chats:['drZEiRlCqxmGn']
    //  }
    //  )
    //add chat
  },
};
</script>

<style lang="scss" scoped>
div {
  font-size: 20rem;
}

.chatitem {
  font-size: 22rem;
  color: #ffffff;
}

</style>
