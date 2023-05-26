<template>
  <button @click="deleteChat" class="chat-settings">
    <span class="material-symbols-outlined"> more_vert </span>
  </button>
</template>

<script>
import { writeBatch, doc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import store from "@/store/store";
import { collection, getDocs, getDoc, Timestamp } from "firebase/firestore";

export default {
  methods: {
    async deleteChat() {
      return
      console.log("pizda maline");
      //user 1
      //user 2
      const db = firebase.firestore();
      //delete collection
      // Get a new write batch
      const batch = writeBatch(db);

      // Set the value of 'NYC'
      // Update the population of 'SF'
      const myId = this.$store.state.user.user.uid;

      const chatId = this.$store.state.chat.chatId;

      console.log(myId, chatId, chatId.replace(myId, ""));

    

      const user2Ref = doc(db, "usersLinksToChat", chatId.replace(myId, ""));

      const user1Ref = doc(db, "usersLinksToChat", myId);

      batch.update(user1Ref, {
        [chatId]: firebase.firestore.FieldValue.delete(),
      });

      batch.update(user2Ref, {
        [chatId]: firebase.firestore.FieldValue.delete(),
      });

      const chatRef = db.collection("chatMessages").doc(chatId);

      batch.delete(chatRef);

      //   // Delete the city 'LA'
      //   const laRef = doc(db, "cities", "LA");
      //   batch.delete(laRef);

      //   // Commit the batch
        await batch
          .commit()
          .then(() => {
            console.log("Batch operation successful");
          })
          .catch((error) => {
            console.error("Batch operation failed:", error);
          });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
.chat-settings {
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: gray;
  border-radius: 20px;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);

  &:hover {
    background-color: $hover;
  }
}
</style>
