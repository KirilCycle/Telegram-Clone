<template>
  <Teleport to="body">
    <div class="msg-action-wrap">
      <div ref="modal" class="msg-actions">
        <ul class="actions-list">
          <li @click="prepareToReply">
            <span class="material-symbols-outlined"> reply </span>
            <button>Reply</button>
          </li>
          <li>
            <span class="material-symbols-outlined"> forward </span>
            <button>Forward</button>
          </li>
          <li>
            <span class="material-symbols-outlined"> file_copy </span>
            <button>Coppy Text</button>
          </li>
          <!-- v-if="$store.state.user.user.uid === "  -->
          <li v-if="ableToDelete" @click="deleteMsg" class="delete-action">
            <span class="material-symbols-outlined"> delete </span>
            <button>Delete</button>
          </li>
        </ul>
      </div>
    </div>
  </Teleport>
</template>

<script>
import store from "@/store/store";
import { updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import firebase from "firebase/compat/app";
import { doc, setDoc } from "firebase/firestore";

export default {
  data() {
    return {
      ableToDelete:
        store.state.message.selectedMsgData.userId ===
        store.state.user.user.uid,
    };
  },
  methods: {
    prepareToReply() {
      const msgData = store.state.message.selectedMsgData;

      console.log(msgData, "SSS");

      store.commit("message/setReplyTarget", {
        text: msgData.text,
        from: msgData.userName,
        ...(msgData.imageRef ? { img: msgData.imageRef } : {}),
      });
    },


    async deleteMsg() {
      '1'
      if (
        store.state.message.selectedMsgData.userId === store.state.user.user.uid
      ) {
        const db = firebase.firestore();

        try {
          const chatRef = doc(db, "chatMessages",  store.state.chat.chatId);

          await updateDoc(chatRef, {
            messages: firebase.firestore.FieldValue.arrayRemove(store.state.message.selectedMsgData),
          });

          console.log("Message deleted successfully!");
        } catch (error) {
          console.error("Error deleting message:", error);
        }
      }
    },
  },

  mounted() {
    console.log(
      store.state.message.coords.x,
      store.state.message.coords.y,
      "AAA"
    );

    // this.$refs.modal.style.transform  = `translate(${store.state.message.coords.x}}px,${store.state.message.coords.y}px)`

    this.$refs.modal.style.transform = `translate(${store.state.message.coords.x}px, ${store.state.message.coords.y}px)`;
    // this.$refs.modal.style.transform = `translateY(${ -store.state.message.coords.y  }px)`
  },
};
</script>

<style lang="scss" scoped>
.msg-action-wrap {
  width: 100%;
  height: 100%;
  position: fixed;
  background-color: #4646462e;
}

.msg-actions {
  top: 0%;
  width: 200px;
  border-radius: 5px;
  background-color: #353535f1;
  position: absolute;
  backdrop-filter: blur(4px);
  height: min-content;
  padding: 5px;

  .actions-list {
    width: 100%;
    font-size: 1rem;
    font-weight: normal;
    box-sizing: border-box;

    li {
      font-family: Avenir, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      color: #fff;
      padding: 5px 12px 5px 12px;
      box-sizing: border-box;
      display: flex;
      border-radius: 3px;
      align-items: center;
      flex-direction: row;
      cursor: pointer;

      button {
        height: 100%;
        padding: 10px;
        cursor: pointer;
      }

      span {
        font-size: 0.8rem sans-serif;
        font-weight: 300;
      }

      &:hover {
        background-color: rgb(41, 41, 41);
      }
    }
    .delete-action {
      color: #e02b2b;
    }
  }
}
</style>
