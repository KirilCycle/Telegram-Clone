<template>
  <div class="wrap">
    <div class="content">
      <div v-observer="fetchMore"></div>
      <TransitionGroup name="list" class="list-wrap" tag="div">
        <message-item
          v-for="mes in messages"
          :key="mes.id"
          :message="mes"
        ></message-item>
      </TransitionGroup>
      <button
        v-if="!allowedAutoScroll"
        @click.prevent="scrollToBottom"
        class="scrll-to-btm"
      >
        <span class="material-symbols-outlined"> keyboard_arrow_down </span>
      </button>
      <div class="bottom" ref="bottom">
        <div v-desapeared="disableAutoScroll"></div>
      </div>
    </div>

    <reply-message-border
      v-if="store.state.chat.replyMsgRef"
    ></reply-message-border>
    
    <div class="input-container">
      <div class="input_content">
        <selected-file-modal
          @notready="messageisNotReady = true"
          :notready="messageisNotReady"
          @sendmesimg="sendMessage"
        ></selected-file-modal>
        <input type="text" placeholder="Write message..." v-model="value" />

        <div class="input_container_btns_container">
          <button @click.prevent="sendMessage(value)">
            <span class="material-symbols-outlined"> arrow_upward </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store/store";
import { nextTick, ref, watch } from "vue";
import { query, orderBy, startAt, startAfter } from "firebase/firestore";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getAuth, updateProfile } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import MessageItem from "../components/MessageItem.vue";
import { uuidv4 } from "@firebase/util";
import SelectedFileModal from "@/components/SelectedFileModal.vue";
import ReplyMessageBorder from "@/components/ReplyMessageBorder.vue";

export default {
  components: { MessageItem, SelectedFileModal, ReplyMessageBorder },

  data() {
    return {
      store: store,
    };
  },
  mounted() {
    setTimeout(() => {
      console.log("Mounted - ok");
      console.log(this.$refs);
    }, 5000);
  },

  setup() {
    let previousDoc = ref(null);

    // let replyTarget = ref(store.state.chat.replyMsgRef);

    // store.state.chat.replyMsgRef.

    // const { messages } = useChat();
    // const firestore = store.state.user.firebaseSetup.firestore

    // setTimeout(() => {console.log(this.$refs,'FROM DATAAd ') }, 2000)

    const bottom = ref(null);

    console.log(bottom, "bor");

    const value = ref("");
    const total = ref(0);
    const messageisNotReady = ref(false);
    const allowedAutoScroll = ref(true);

    const opened = ref(30);
    const messagesColection = store.state.user.firestore.collection("messages");
    const messages = ref([]);

    function fetchPrevious() {
      console.log(messages);
    }
    const db = firebase.firestore();

    // const collectionRef = db.collection("messages");

    // const messagesRef = store.state.user.firestore.collection("messages");

    // query.onSnapshot((snapshot, parameters) => {
    //  console.log( snapshot.docs, 'docs');
    //  snapshot.docs
    //     .map((doc) => ({ id: doc.id, ...doc.data() }))
    //     .reverse();
    // });

    //limitToLast(12) наш последний индекс

    const messagesQuery = messagesColection
      .orderBy("createdAt", "desc")
      .limit(5);
    //.limitToLast(10) получить последних
    //
    //limit - taking lasts
    //
    //  .limitToLast(20)

    let query = db
      .collection("messages")
      .orderBy("createdAt", "desc")
      // .limit(10)
      // .endBefore('f07c4709-4a87-49b9-a7fb-b1e1f3c5ac09E7iKQQ9OuWY6I1E0W06Bv9WYZ0l1HHUUUUGGaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
      //  .limitToLast('c82e4c2f-e4a0-4799-a7f0-6d89210ef4cfE7iKQQ9OuWY6I1E0W06Bv9WYZ0l1')


      //.endBefore начиная с 

    const unsubscribe = query.onSnapshot((snapshot, parameters) => {
      messages.value = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .reverse();
      console.log(messages.value, "docs");
    });

    function fetchMore() {
      query.limit(2);
    }

    async function sendMessage(text, imagePath) {
      // const { photoURL, uid, displayName } = store.state.user.value;
      if (auth.currentUser && text.length < 2000) {
        scrollToBottom();
        const message = {
          userName: auth.currentUser.displayName
            ? auth.currentUser.displayName.slice(0, 25)
            : auth.currentUser.email,
          userId: auth.currentUser.uid,
          text: text,
          messageId:
            uuidv4() +
            auth.currentUser.uid.replaceAll(" ", "") +
            text.replaceAll(" ", ""),
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        };
        if (imagePath) {
          messageisNotReady.value = true;
          message.imageRef = imagePath;
        }
        if (auth.currentUser.photoURL) {
          message.userPhotoURl = auth.currentUser.photoURL;
        }
        messagesColection.add(message).then((res) => {
          console.log("completed");
          messageisNotReady.value = false;
        });
        value.value = "";
      }
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
          if (allowedAutoScroll.value) {
            bottom.value?.scrollIntoView({ behavior: "smooth" });
          }
        });
      },
      { deep: true }
    );

    function disableAutoScroll(visibleBot) {
      allowedAutoScroll.value = visibleBot;
    }

    return {
      sendMessage,
      disableAutoScroll,
      fetchMore,
      bottom,
      scrollToBottom,
      value,
      messages,
      fetchPrevious,
      messageisNotReady,
      allowedAutoScroll,
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

  .list-wrap {
    position: relative;
    top: 65px;
    margin-bottom: 70px;
  }
  .bottom {
    width: 100%;
    height: 5px;
    position: relative;

    div {
      position: absolute;
      height: 50px;
      width: 100%;
    }
  }
  .scrll-to-btm {
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
    position: fixed;

    width: 35px;
    height: 35px;
    background-color: rgb(0, 0, 0);
    color: rgb(255, 255, 255);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 17.5px;
    right: 10px;
    border: 1px solid rgb(42, 42, 42);
    bottom: 120px;
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
  margin: 0px;
  width: 100%;
  padding: 0px 10px 0px 10px;
  background-color: #1f1e1ee6;
  backdrop-filter: blur(8px);
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  flex-direction: column;
  bottom: 0;
  align-items: center;
  box-sizing: border-box;

  .input_content {
    box-sizing: border-box;
    width: 100%;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    display: flex;

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
      width: 65%;
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
