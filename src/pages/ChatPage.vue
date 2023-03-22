<template>
  <div class="wrap">
    <div class="content">
      <div v-for="mes in messages" :key="mes.id">
       <message-item :message="mes"></message-item>
      </div>
      <div ref="bottom"></div>
    </div>
    <div class="input-container">
      <input placeholder="Write message..." v-model="value" />
      <button @click="sendMessage(value)">
        <span class="material-symbols-outlined"> arrow_upward </span>
      </button>
    </div>
  </div>
</template>

<script>
import { auth, useChat, onUnmounted } from "@/main";
import store from "@/store/store";
import { nextTick, ref, watch } from "vue";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getAuth, updateProfile } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import MessageItem from '../components/MessageItem.vue';

export default {
  components: { MessageItem },
  setup() {
    // const { messages } = useChat();
    // const firestore = store.state.user.firebaseSetup.firestore
    const bottom = ref(null);

    console.log(bottom, "bor");

    const db = store.state.user.db;

    async function getUSesr() {
      console.log(chats);
    }

    const value = ref("");

    const messagesColection = store.state.user.firestore.collection("messages");

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

    async function sendMessage(text) {
      // const { photoURL, uid, displayName } = store.state.user.value;
      messagesColection.add({
        // userName: displayName,
        // userId: uid,
        // userPhotoURl: photoURL,
        text: text,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }

    const auth = getAuth();

    updateProfile(auth.currentUser, {
      displayName: "Jane Q. User",
      photoURL: "https://example.com/jane-q-user/profile.jpg",
    })
      .then(() => {
        // Profile updated!
        // ...
      })
      .catch((error) => {
        // An error occurred
        // ...
      });

    // Start listing users from the beginning, 1000 at a time.

    watch(
      messages,
      () => {
        nextTick(() => {
          console.log("tock", bottom.value);
          bottom.value?.scrollIntoView({ behavior: "smooth" });
        });
      },
      { deep: true }
    );

    return {
      sendMessage,
      bottom,
      nan,
      messages,
      getUSesr,
    };
  },
};

// const colections = useCollectionData(firestore.colection('global').orderBy('createdAt'))
</script>

<style lang="scss" scoped>
$crazy_color: #00ff44;
.content {
  width: 100%;
  background-color: #000000;
  padding-bottom: 50px;
  padding-top: 30px;
}

.input-container {
  position: fixed;
  display: flex;
  width: 100%;
  bottom: 0;
  height: 50px;
  background-color: #1f1e1ed5;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);

  button {
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    border-radius: 17.5px;
    background-color: #000000;
    :hover {
      color: $crazy_color;
    }
    span {
      font-size: 16px;
    }
  }

  input {
    width: 80%;
    background-color: #00000000;
    height: 35px;
    border: 1px solid gray;
    border-radius: 35px;
    padding-left: 5px;
    margin-right: 5px;
    color: white;
    &:focus {
      border: 1px solid $crazy_color;
    }
  }
}
</style>
