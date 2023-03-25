<template>
  <div class="wrap">
    <div class="content">
      <div v-observer="fetchPrevious"></div>
      <TransitionGroup name="list" tag="div">
        <message-item
          v-for="mes in messages"
          :key="mes.id"
          :message="mes"
        ></message-item>
      </TransitionGroup>
      <div ref="bottom"></div>
    </div>
    <div class="input-container">
      <div class="input_content">
        <input placeholder="Write message..." v-model="value" />

        <input
          type="file"
          @change="(event) => uploadImage(event.target.files[0])"
          class="image-input"
        />

        <button @click="sendMessage(value)">
          <span class="material-symbols-outlined"> arrow_upward </span>

          <button @click="scrollToBottom" class="scrll-to-btm">
            <span class="material-symbols-outlined"> keyboard_arrow_down </span>
          </button>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store/store";
import { nextTick, ref, watch } from "vue";
import { query, orderBy, startAt, startAfter } from "firebase/firestore";
import UniqueId from "vue-unique-id";
import { v4 as uuid } from "uuid";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getAuth, updateProfile } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import MessageItem from "../components/MessageItem.vue";
import { uploadBytes, listAll } from "@firebase/storage";
import { getStorage, getDownloadURL } from "firebase/storage";

export default {
  components: { MessageItem },
  setup() {
    // Create a reference with an initial file path and name
    const storage = getStorage();
    const pathReference = store.state.user.customStorageRef(storage, "images/logo-kirilla_v2.png0120ba5e-8bed-4d11-80f5-a5e15a880a27");

    async function SUS (){
      getDownloadURL(pathReference).then((url) => {
              console.log(url,'AS PATH');
              console.log(it)
            });
    }

    SUS()


   

    let previousDoc = ref(null);
    // const { messages } = useChat();
    // const firestore = store.state.user.firebaseSetup.firestore
    const bottom = ref(null);
    console.log(bottom, "bor");
    const db = store.state.user.db;

    console.log(db, "DB");

    const value = ref("");

    const total = ref(0);

    const opened = ref(30);

    const imageUpload = ref(null);

    const messagesColection = store.state.user.firestore.collection("messages");

    function fetchPrevious() {
      // const res = messagesColection
      // .orderBy("createdAt", "desc")
      // .limitToLast(total.value - 30);
      console.log(messages);
    }

    async function myList() {
      listAll(pathReference).then((response) => {

        response.items.forEach((it) => {
          getDownloadURL(it).then((url) => {
            console.log(url);
            console.log(it)
          });
        });
      });
    }

    myList();

    const messagesQuery = messagesColection
      .orderBy("createdAt", "desc")
      .limit(30);
    //.limitToLast(10) получить последних
    //
    //limit - taking lasts
    //
    //  .limitToLast(20)
    const messages = ref([]);

    const unsubscribe = messagesQuery.onSnapshot((snapshot, parameters) => {
      console.log(messagesColection.count);
      total.value = snapshot.docs.length;
      messages.value = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .reverse();
    });

    async function sendMessage(text) {
      value.value = " ";
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

    console.log(auth, "AUTH");
    // Start listing users from the beginning, 1000 at a time.

    function scrollToBottom() {
      bottom.value?.scrollIntoView({ behavior: "smooth" });
    }
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

   async function uploadImage(doc) {
      imageUpload.value = doc;

      if (imageUpload.value !== null) {
        const imageRef = store.state.user.customStorageRef(
          store.state.user.storage,
          `images/${imageUpload.value.name + uuid()}`
        );
        uploadBytes(imageRef, imageUpload.value)
          .then((res) => {
            console.log(res.ref._location.path_);
              messagesColection.add({
                imageRef:res.ref._location.path_, 
                text: 'D',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              });
            
          })
          .catch((e) => console.log(e),'AAA ERRO MESSAGE');
        // console.log(uuid())
      }
    }

    return {
      sendMessage,
      bottom,
      messages,
      scrollToBottom,
      fetchPrevious,
      uploadImage,
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
  min-height: 100vh;

  .scrll-to-btm {
    position: fixed;
    bottom: 100px;
    width: 35px;
    height: 35px;
    background-color: rgb(0, 0, 0);
    color: rgb(61, 61, 61);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 17.5px;
    right: 10px;
    border: 1px solid rgb(42, 42, 42);
    bottom: 100px;
    &:hover {
      color: #00ff44;
    }
  }

  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s ease;
  }
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
}
.input-container {
  width: 100%;
  padding-left: 10px;
  padding-right: 10px;
  background-color: #1f1e1ed5;
  height: 50px;
  position: fixed;
  flex-direction: column;
  bottom: 0;
  align-items: center;
  backdrop-filter: blur(5px);

  .input_content {
    width: 100%;
    margin-right: 5px;
    display: flex;
    .image-input {
      width: 20px;
      height: 20px;
      background-color: #fff;
    }

    button {
      width: 35px;
      height: 35px;
      margin-left: 10px;
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
      -webkit-appearance: none;
      background-color: #00000000;
      height: 35px;
      border: 1px solid gray;
      border-radius: 35px;
      padding-left: 5px;
      font-size: 1.1rem;
      padding-left: 10px;
      color: white;
      &:focus {
        border: 1px solid $crazy_color;
      }
    }
  }
}
</style>
