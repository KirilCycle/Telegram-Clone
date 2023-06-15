<template>
 <div class="wrap"> 
  <control-button @click="deleteChat" class="chat-settings">
    <span class="material-symbols-outlined"> more_vert </span>
  </control-button>
 </div>
</template>

<script>


export default {
  methods: {
    // async deleteChat() {
    //   return
    //   console.log("pizda maline");
    //   //user 1
    //   //user 2
    //   const db = firebase.firestore();
    //   //delete collection
    //   // Get a new write batch
    //   const batch = writeBatch(db);

    //   // Set the value of 'NYC'
    //   // Update the population of 'SF'
    //   const myId = this.$store.state.user.user.uid;

    //   const chatId = this.$store.state.chat.chatId;

    //   console.log(myId, chatId, chatId.replace(myId, ""));

    

    //   const user2Ref = doc(db, "usersLinksToChat", chatId.replace(myId, ""));

    //   const user1Ref = doc(db, "usersLinksToChat", myId);

    //   batch.update(user1Ref, {
    //     [chatId]: firebase.firestore.FieldValue.delete(),
    //   });

    //   batch.update(user2Ref, {
    //     [chatId]: firebase.firestore.FieldValue.delete(),
    //   });

    //   const chatRef = db.collection("chatMessages").doc(chatId);

    //   batch.delete(chatRef);

    //   //   // Delete the city 'LA'
    //   //   const laRef = doc(db, "cities", "LA");
    //   //   batch.delete(laRef);

    //   //   // Commit the batch
    //     await batch
    //       .commit()
    //       .then(() => {
    //         console.log("Batch operation successful");
    //       })
    //       .catch((error) => {
    //         console.error("Batch operation failed:", error);
    //       });
    // },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
.wrap {
  position: absolute;
  right: 10px;
  height: 100%;

  display: flex;
  align-items: center;
 
}
</style>
