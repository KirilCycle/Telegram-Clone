<template>
  <div class="wrap">
    <div class="content"></div>
    <div class="input-container">
      <input v-model="value" />
      <button @click="sendMessage(value)">Enter</button>
    </div>
  </div>
</template>

<script>
import { auth, firestore, useChat } from "@/main";
import { ref } from "vue";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

export default {
  setup() {
    const { messages } = useChat();
    const value = ref("");
    const messagesColection = firestore.collection('messages')

    const nan = () => {
      console.log(sendMessage);
    };

    async function sendMessage  (text)  {
      // const {photoURL, uid, displayName} = store.state.user.value
      messagesColection.add({
        // userName: displayName,
        // userId: uid,
        // userPhotoURl: photoURL,
        text: text,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    };

    return {
      sendMessage,
      nan,
    };
  },
};

// const colections = useCollectionData(firestore.colection('global').orderBy('createdAt'))
</script>

<style scoped>
.wrap {
}
.content {
}

.input-container {
  position: fixed;
  bottom: 0;
  height: 60px;
  background-color: #fff;
}
</style>
