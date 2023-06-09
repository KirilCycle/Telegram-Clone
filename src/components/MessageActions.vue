<template>
  <div>
    <div @click="close" @touch="close" class="msg-action-wrap">
      <div ref="modal" class="msg-actions">
        <div class="emoji-container">
          <div class="emoji-list">
            <div
              @click="
                () => replyEmoji(em, $store.state.message.selectedMsgData)
              "
              v-for="em in emojis"
              :key="em + 1"
            >
              {{ em }}
            </div>
          </div>

          <div class="emoji_container_circl"></div>
          <div class="emoji_container_smll_circl"></div>
        </div>

        <ul class="actions-list-wrp">
          <optiosn-list-vue :optionsList="messageActions"> </optiosn-list-vue>
          <!-- <li @click="prepareToReply">
            <span class="material-symbols-outlined"> reply </span>
            <button>Reply</button>
          </li>
          <li @click.stop="v = true">
            <span class="material-symbols-outlined"> forward </span>
            <button>Forward</button>
          </li>
          <li @click="selectText">
            <span class="material-symbols-outlined"> file_copy </span>
            <button>Coppy Text</button>
          </li> -->
          <!-- v-if="$store.state.user.user.uid === "  -->
          <!-- <li @click="deleteMsg" class="delete-action">
            <span class="material-symbols-outlined"> delete </span>
            <button>Delete</button>
          </li> -->
        </ul>
      </div>
    </div>

    <forward-modal @close="close" v-if="v"></forward-modal>
  </div>
</template>

<script>
import store from "@/store/store";

import { updateDoc } from "firebase/firestore";
import { deleteDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import { replyEmoji } from "@/features/replyUsingEmoji";
import ForwardModal from "./ForwardModal.vue";
import OptiosnListVue from "./UI/lists/OptiosnList.vue";

export default {
  components: {
    ForwardModal,
    OptiosnListVue,
  },
  data() {
    return {
      db: firebase.firestore(),
      v: false,
      replyEmoji,
      emojis: ["😘", "👎", "👍", "😂", "🐳", "😈", "😘"],
      emojiOptions: {
        chatId: this.$store.state.chat.chatId,
        userId: this.$store.state.user.user.uid,
        selectedMsgData: this.$store.state.message.selectedMsgData,
      },
      messageActions: [
        {
          description: 'reply',
          htmlIcoEl: `  <span class="material-symbols-outlined"> reply </span>`,
          execute: this.prepareToReply
        },
        {
          description: 'forward',
          htmlIcoEl: `  <span class="material-symbols-outlined"> forward </span>`,
          execute: this.prepareToReply
        },
        {
          description: 'coppy ot clipboard',
          htmlIcoEl: `<span class="material-symbols-outlined"> file_copy </span>`,
          execute: this.prepareToReply
        },
        {
          description: 'delete',
          htmlIcoEl: `<span class="material-symbols-outlined"> delete </span>`,
          execute: this.prepareToReply
        },
      ],
    };
  },
  methods: {
    prepareToReply() {
      const msgData = store.state.message.selectedMsgData;

      console.log(msgData, "SSS");

      store.commit("message/setReplyTarget", {
        text: msgData.text,
        from: msgData.userName,
        ...(msgData.source ? { source: msgData.source } : {}),
      });
    },

    close() {
      this.v = false;
      this.$emit("close");
    },

    async replyEmojiss(em) {
      //  // set awdawd waa a a a a a a a a a
      // // Set the "capital" field of the city 'DC'
      // await updateDoc(washingtonRef, {
      //   capital: true
      // });
      const msg = store.state.message.selectedMsgData;

      const user = this.$store.state.user.user.uid;

      let msgRef = this.db
        .collection("chatMessages")
        .doc(store.state.chat.chatId)
        .collection("messages")
        .doc(msg.id);

      if (store.state.message.selectedMsgData.emj) {
        // await updateDoc(msgRef, {
        //   [linkToSendedEm]: arrayUnion(user)
        // });

        async function postReaction(key) {
          let linkToSendedEm = `emj.${key}`;

          console.log(linkToSendedEm, "LETS GO ");

          await updateDoc(msgRef, {
            [linkToSendedEm]: arrayUnion(user),
          });
        }

        const emojis = store.state.message.selectedMsgData?.emj;

        async function removeReaction(key, wasLast) {
          let linkToSendedEm = `emj.${key}`;
          //that kin of emoji was only was sender
          if (wasLast) {
            msgRef.update({
              [linkToSendedEm]: firebase.firestore.FieldValue.delete(),
            });

            return;
          }

          await updateDoc(msgRef, {
            [linkToSendedEm]: arrayRemove(user),
          });
        }

        let founded;
        let last;

        if (emojis) {
          const source = Object.entries(emojis);

          for (let i = 0; i < source.length; i++) {
            for (let j = 0; j < source[i][1].length; j++) {
              let emoji = source[i][0];

              if (source[i][1][j] === user) {
                //case user already used emoji
                founded = emoji;
                last = source[i][1].length === 1;

                break;
              }
            }
          }

          if (founded) {
            if (founded === em) {
              removeReaction(founded, last);
              return;
            }
            removeReaction(founded, last).then(() => {
              postReaction(em);
            });
          } else {
            postReaction(em);
          }
        }
        return;
      }

      msgRef.set(
        {
          emj: {
            [em]: [user],
          },
        },
        { merge: true }
      );
    },

    selectText() {
      const text = this.$store.state.message.selectedMsgData.text;
      navigator.clipboard
        .writeText(text)
        .then(() => {
          console.log("Text copied to clipboard");
        })
        .catch((error) => {
          console.error("Error copying text to clipboard:", error);
        });
    },

    async deleteMsg() {
      try {
        console.log("EXECUTE FN");

        let res = this.db
          .collection("chatMessages")
          .doc(store.state.chat.chatId)
          .collection("messages")
          .doc(store.state.message.selectedMsgData.id);

        res.delete();
      } catch (e) {
        console.log(e);
      }
    },

    close() {
      store.commit("message/setVisible", false);
    },
  },

  mounted() {
    let x = store.state.message?.coords?.x;
    let y = store.state.message?.coords?.y;

    const estimatedSpace = 190;

    if (window.innerHeight - y < 220) {
      y -= estimatedSpace;
    }
    if (window.innerWidth - x < 220) {
      x -= estimatedSpace;
    }

    if (x && y) {
      this.$refs.modal.style.transform = `translate(${x}px, ${y}px)`;
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors";
.msg-action-wrap {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 10;
}

.msg-actions {
  top: 0%;
  width: 200px;
  border-radius: 5px;

  position: absolute;
  height: min-content;
  display: flex;
  justify-content: center;
  padding: 5px;

  .emoji-container {
    width: auto;
    height: 35px;
    display: flex;
    flex-direction: row;
    position: absolute;
    top: -49px;
    background-color: $content-main;
    border-radius: 30px;

    .emoji-list {
      width: 100%;
      height: 35px;
      align-items: center;

      flex-direction: row;
      display: flex;

      div {
        margin: 0.5px;
        cursor: pointer;
        height: 30px;
        width: 30px;
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          background-color: $hover;
        }
      }
    }

    .emoji_container_circl {
      width: 25px;
      height: 25px;
      border-radius: 12.5px;
      position: absolute;
      z-index: -1;
      right: 5px;
      bottom: -7px;
      background-color: $content-main;
    }

    .emoji_container_smll_circl {
      width: 13px;
      height: 13px;
      position: absolute;
      right: 14px;
      border-radius: 5px;
      bottom: -23px;
      background-color: $content-main;
    }
  }
  

  .actions-list-wrp {
    width: 100%;
    box-sizing: border-box;
    position: absolute;

    top: 40px;
   
  }
}

.dark .msg-actions {
  background-color: $content-main-l;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  
}

.dark .msg-actions .emoji-container {
  background-color: $content-main-l;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  .emoji_container_smll_circl {
    background-color: $content-main-l;
  }

  .emoji_container_circl {
    background-color: $content-main-l;
  }
}
</style>
