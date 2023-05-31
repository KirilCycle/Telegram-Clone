<template>
  <div class="forward">
    <div class="forward_modal">
      <div class="forward_modal_top_content">
        <button>
          <span class="material-symbols-outlined"> close </span>
        </button>

        <input
          v-on:input="(e) => handleSearch(e.target.value)"
          placeholder="Forward to..."
        />
      </div>
      <div class="forward_modal_list">
        <div @click.prevent="handleSelect" class="chat-list">
          <chat-list :storePath="'message'" :chatList="chatList"></chat-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChatList from "./ChatList.vue";
import { ref } from "vue";
import store from "@/store/store";
import firebase from "firebase/compat/app";

export default {
  components: {
    ChatList,
  },
  data() {
    return {};
  },
  methods: {
    handleSearch(q) {
      this.$store.commit("message/setQuery", q);
    },

    handleSelect() {
      const modified = store.state.message.selectedMsgData;

      delete modified.id;
      delete modified.emj;
      delete modified.createdAt;
      delete modified.replyData;

      modified.sender =  {
       userId: modified.userId,
       userName: modified.userName
       
      }
        

     console.log(modified, 'MOD');

      store.commit(
        "message/setForwardTarget",
        store.state.message.selectedMsgData
      )

      this.$emit('close')

    },
  },

  setup() {
    const db = firebase.firestore();

    const collectionRef = db.collection("usersLinksToChat");

    const chatList = ref("");

    collectionRef.doc(store.state.user.user.uid).onSnapshot((doc) => {
      if (doc.exists) {
        const formated = Object.values(doc.data());
        // Do something with the document data

        console.log(store.state.chat.chatId);

        chatList.value = formated.sort(
          (a, b) => b.lastMsg.createdAt.seconds - a.lastMsg.createdAt.seconds
        );
      } else {
        console.log("No such document!");
      }
    });

    return {
      chatList,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.chat-list {
  overflow-x: hidden;
  position: absolute;
  width: 100%;
  top: 60px;
  overflow-y: scroll;
}

.chat-list::-webkit-scrollbar {
  display: block;
  width: 5px;
}

.chat-list-wrap::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.648);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

.chat-list-wrap::-webkit-scrollbar-thumb {
  background: rgba(152, 152, 152, 0.343);
  border-radius: 20px;
}

.forward {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.354);
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
    z-index: 10;

  .forward_modal {
    width: 420px;
    height: 80%;
    max-height: 900px;
    background-color: $content-main;
    border-radius: 20px;
    position: relative;

    .forward_modal_top_content {
      width: 100%;
      height: 60px;
      position: absolute;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-left: 10px;
      top: 0px;

      button {
        width: 40px;
        height: 40px;
        border-radius: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        &:hover {
          background-color: $hover;
        }

        span {
          font-size: 1.6rem;
          color: gray;
        }
      }

      input {
        caret-color: $second;
        font-size: 1.2rem;
        height: 40px;
      }
    }
  }
}

.dark .forward {
  .forward_modal {
    background-color: $content-main-l;
  }
}
</style>
