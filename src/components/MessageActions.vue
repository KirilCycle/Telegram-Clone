<template>
  <Teleport to="body">
    <div @click="close" @touch="close" class="msg-action-wrap">
      <div ref="modal" class="msg-actions">
        <div class="emoji-container">
          <div class="emoji-list">
            <div @click="() => replyEmoji('😂')">😂</div>
            <div @click="() => replyEmoji('😘')">😘</div>
            <div @click="() => replyEmoji('👍')">👍</div>
            <div @click="() => replyEmoji('😍')">😍</div>
            <div @click="() => replyEmoji('🐳')">🐳</div>
            <div @click="() => replyEmoji('👍')">👍</div>
            <div @click="() => replyEmoji('👎')">👎</div>
            <div @click="() => replyEmoji('😈')">😈</div>
          </div>

          <div class="emoji_container_circl"></div>
          <div class="emoji_container_smll_circl"></div>
        </div>

        <ul class="actions-list">
          <li @click="prepareToReply">
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
          </li>
          <!-- v-if="$store.state.user.user.uid === "  -->
          <li v-if="ableToDelete" @click="deleteMsg" class="delete-action">
            <span class="material-symbols-outlined"> delete </span>
            <button>Delete</button>
          </li>
        </ul>
      </div>
    </div>

    <forward-modal @close="close" v-if="v"></forward-modal>

  </Teleport>
</template>

<script>
import store from "@/store/store";
import { updateDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import { doc, setDoc } from "firebase/firestore";
import { deleteDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import ForwardModal from './ForwardModal.vue';

export default {
  data() {
    return {
      ableToDelete:
        store.state.message.selectedMsgData.userId ===
        store.state.user.user.uid,
      db: firebase.firestore(),
      v: false,
    };
  },
  components: {
   ForwardModal  
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
          this.v = false
          this.$emit('close')
    },

    async replyEmoji(em) {
      
      
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

          console.log("HERE WE GO", key, user);

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
      const el = this.$store.state.message.replyMsgRef;

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
      if (
        store.state.message.selectedMsgData.userId === store.state.user.user.uid
      ) {
        // const chatRef = doc(db, "chatMessages", store.state.chat.chatId);

        try {
          console.log("EXECUTE FN");

          let res = this.db
            .collection("chatMessages")
            .doc(store.state.chat.chatId)
            .collection("messages")
            .doc(store.state.message.selectedMsgData.id);

          res.delete();

          console.log(
            store.state.chat.chatId,
            " msg =>",
            store.state.message.selectedMsgData.id
          );
        } catch (e) {
          console.log(e);
        }
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
@import "@/styles/colors";
.msg-action-wrap {
  width: 100%;
  height: 100%;
  position: fixed;
}

.msg-actions {
  top: 0%;
  width: 200px;
  border-radius: 5px;
  background-color: $content-main;
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
      background-color:  $content-main;
    }

    .emoji_container_smll_circl {
      width: 13px;
      height: 13px;
      position: absolute;
      right: 14px;
      border-radius: 5px;
      bottom: -23px;
      background-color:  $content-main;
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
      color: $text-main;
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
        background-color: $hover;
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


.dark .msg-actions {
  background-color: $content-main-l;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  .actions-list {

    li {
      color: $text-main-l;
    }
    .delete-action {
      color: #e02b2b;
    }
  }

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
