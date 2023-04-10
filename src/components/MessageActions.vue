<template>
  <Teleport to="body">
    <div @click="close" @touch="close" class="msg-action-wrap">
      <div ref="modal" class="msg-actions">
        <div class="emoji-container">
          <ul>
            <li>😂</li>
            <li>😘</li>
            <li>👍</li>
            <li>😍</li>
            <li>🐳</li>
            <li></li>
          </ul>

          <div class="emoji_container_circl"></div>
          <div class="emoji_container_smll_circl"></div>
        </div>

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
import { updateDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import { doc, setDoc } from "firebase/firestore";
import { deleteDoc } from "firebase/firestore";

export default {
  data() {
    return {
      ableToDelete:
        store.state.message.selectedMsgData.userId ===
        store.state.user.user.uid,
      emoji: ["😂", "😘", "☺️", "👍", "😍", " 🐳"],
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
      if (
        store.state.message.selectedMsgData.userId === store.state.user.user.uid
      ) {
        const db = firebase.firestore();

        const chatRef = doc(db, "chatMessages", store.state.chat.chatId);

        // const messagesRef = db
        //           .collection("chatMessages")
        //           .doc(chatId)
        //           .collection("messages");
        //           batch.set(messagesRef.doc(), message);

        const res = db
          .collection("chatMessages")
          .doc(store.state.chat.chatId)
          .collection("messages")
          .doc(store.state.message.selectedMsgData.id)
          .delete();

        console.log(res);

        // delete();

        // deleteDoc(doc(db, "chatMessages", "messages"))
      }
    },

    close() {
      store.commit("message/setVisible", false);
    },
  },

  mounted() {
    let x = store.state.message?.coords?.x;
    let y = store.state.message?.coords?.y;

    if (y && window.innerHeight - y < 220) {
      y -= 160;
    }

    if (x && y) {
      this.$refs.modal.style.transform = `translate(${x}px, ${y}px)`;
    }
  },
};
</script>

<style lang="scss" scoped>
.msg-action-wrap {
  width: 100%;
  height: 100%;
  position: fixed;
}

.msg-actions {
  top: 0%;
  width: 200px;
  border-radius: 5px;
  background-color: #353535;
  position: absolute;
  height: min-content;
  display: flex;
  justify-content: center;
  padding: 5px;

  .emoji-container {
    width: 270px;
    height: 35px;
    position: absolute;
    top: -49px;
    background-color: #353535;
    border-radius: 30px;

    .emoji_container_circl {
      width: 25px;
      height: 25px;
      border-radius: 12.5px;
      position: absolute;
      right: 5px;
      bottom: -7px;
      background-color: #353535;
    }

    .emoji_container_smll_circl {
      width: 12px;
      height: 12px;
      position: absolute;
      right: 14px;
      border-radius: 6px;
      bottom: -23px;
      background-color: #353535;
    }
  }

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

@media (pointer: coarse) {
  .msg-action-wrap {
    background-color: rgba(0, 0, 0, 0.778);
    z-index: 200;
  }

  .msg-actions {
    position: absolute;
    top: 50%;
    z-index: 201;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
