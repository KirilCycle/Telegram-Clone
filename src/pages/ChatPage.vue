<template>
  <div class="wrap">
    <div class="content">
      <div v-for="mes in messages" :key="mes.id">
        <p>{{ mes.text }}</p>
      </div>
    </div>
    <div class="input-container">
      <input v-model="value" />
      <button @click="sendMessage(value)">Enter</button>
    </div>
  </div>
</template>

<script>
import { auth, firestore, useChat, onUnmounted } from "@/main";
import store from "@/store/store";
import { ref } from "vue";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

export default {
  setup() {
    // const { messages } = useChat();
    const value = ref("");
    const messagesColection = firestore.collection("messages");
    const messagesQuery = messagesColection
      .orderBy("createdAt", "desc")
      .limit(200);

    const messages = ref([]);

    const unsubscribe = messagesQuery.onSnapshot((snapshot) => {
      messages.value = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .reverse();
    });

    const nan = () => {
      console.log(messages);
    };

    async function getMarker() {
      const snapshot = await firebase.firestore().collection("messages").get();
      return snapshot.docs.map((doc) => doc.data());
    }

    async function sendMessage(text) {
      const { photoURL, uid, displayName } = store.state.user.value;
      messagesColection.add({
        userName: displayName,
        userId: uid,
        userPhotoURl: photoURL,
        text: text,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }

    return {
      sendMessage,
      nan,
      messages,
    };
  },
};

// const colections = useCollectionData(firestore.colection('global').orderBy('createdAt'))
</script>

<style scoped>
.wrap {
}
.content {
  width: 100vw;
  height: 100vh;
}

.input-container {
  position: fixed;
  bottom: 0;
  height: 60px;
  background-color: #fff;
}
</style>
