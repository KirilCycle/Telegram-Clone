<template>
  <div>
    <div class="img-container">
      <img />
    </div>
    <div class="chatitem_info_container">
      <h3>{{chatName}}</h3>
      <p>{{ item.lastMessage }}</p>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/compat/app";
import { doc, setDoc } from "firebase/firestore";
import { collection, getDocs, getDoc, Timestamp } from "firebase/firestore";
import store from "@/store/store";

export default {
  data() {
    return {
      item: {},
      enotherUserId: "",
      enotherUser: {},
      db:  firebase.firestore()

    };
  },
  computed: {
     chatName () {

       let us = this.enotherUser

       if( us?.displayName  ) {
        return us.displayName
       } 
      return us.email
     }
  },
  props: {
    chatId: String,
  },
  methods: {
    async fetchChat() {
    

      const myCollectionRef = this.db.collection("chats");

      const documentRef = myCollectionRef.doc(this.chatId);

      // Retrieve the document using the get() method
      documentRef
        .get()
        .then((doc) => {
          this.item = doc.data();

          this.enotherUserId = this.chatId.replace(store.state.user.user.uid, "");

          this.fethcEnotherUser();

      
        })
        .catch((error) => {
          console.log("Error getting chat:", error);
        });
    },

    async fethcEnotherUser() {
     

      const myCollectionRef = this.db.collection("usersPrew");

      const documentRef = myCollectionRef.doc(this.enotherUserId);

      // Retrieve the document using the get() method
      documentRef
        .get()
        .then((doc) => {
          this.enotherUser = doc.data()
        })
        .catch((error) => {
          console.log("Error getting user:", error);
        });
    },
  },
  mounted() {
    this.fetchChat();
  },
};
</script>

<style lang="scss" scoped></style>
