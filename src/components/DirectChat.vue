<template>
    <div v-for="txt in chat.messages" :key="txt">{{ txt }}</div>
</template>

<script>
import { collection, getDocs, getDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import store from "@/store/store";
import { ref } from "vue";
import { getDatabase, onValue } from "firebase/database";
import { updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
export default {
  props: {
    chatId: Array,
    required: true,
  },

  setup(props) {
    const db = firebase.firestore();

    // const docRef = doc(db, "usersLinksToChat", "loVxhSxDf7dbHOJ6Sjmtdr1tyZ52");

    const chat = ref("");

    const slectedChatRef = db.collection("chats");

    console.log(props.chatId,'TEST');

    //  <div v-for="txt in chat.messages" :key="txt">{{ txt }}</div>

    slectedChatRef.doc(props.chatId).onSnapshot((doc) => {
      if (doc.exists) {
        // Do something with the document data
        chat.value = doc.data();

        console.log(chat.value, "cht but isnt list juct cht");
      } else {
        console.log("No such document!");
      }
    });

    return {
        chat
    }

  },
};
</script>

<style lang="scss" scoped></style>
