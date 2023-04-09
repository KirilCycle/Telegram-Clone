<template>
  <div class="new-chat">
    <h2>
      {{
        `This is start of your legendary conversation with ${
          $store.state.chat.selectedUser.displayName
            ? $store.state.chat.selectedUser.displayName
            : $store.state.chat.selectedUser.email
        }`
      }}
    </h2>
    <chat-input :sendMsg="sendMessageToFoundedChat"></chat-input>
  </div>
</template>

<script>
import ChatInput from "./ChatInput.vue";
import { collection, getDocs, getDoc, Timestamp } from "firebase/firestore";
import firebase from "firebase/compat/app";
import store from "@/store/store";
import { ref } from "vue";
import { getDatabase, onValue } from "firebase/database";
import { updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { doc, setDoc, writeBatch } from "firebase/firestore";
import DirectChat from "@/components/DirectChat.vue";
import FoundedChatsList from "@/components/FoundedChatsList.vue";
import { getAuth } from "firebase/auth";
import { uuidv4 } from "@firebase/util";



export default {
  components: {
    ChatInput,
  },
  data() {
    return {};
  },
  setup() {

    const db = firebase.firestore();

    const auth = getAuth();

    async function sendMessageToFoundedChat(v) {
      if (auth.currentUser.uid && store.state.chat.selectedUser.uid) {
        const userId1 = auth.currentUser.uid;
        const userId2 = store.state.chat.selectedUser.uid;

        const createNewChatid = userId1 + userId2;

        const user1Ref = db.collection("usersLinksToChat").doc(userId1);
        const user2Ref = db.collection("usersLinksToChat").doc(userId2);

        const chatId = userId1 + userId2;
        const enotherChatId = userId2 + userId1;

        const message = {
          userName: auth.currentUser.displayName
            ? auth.currentUser.displayName.slice(0, 25)
            : auth.currentUser.email.replace("@gmail.com", ""),
          userId: auth.currentUser.uid,
          text: v,
          createdAt: Timestamp.now(),
          id: uuidv4() + auth.currentUser.uid.replaceAll(" ", ""),
          // createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        };
        if (auth.currentUser.photoURL) {
          message.userPhotoURl = auth.currentUser.photoURL;
        }

        const chatData = {
          lastMessage: { text: message.text, createdAt: message.createdAt },
          uid: chatId,
        };

        const chatsRef = db.collection("chatMessages");
        const chatDocRef = chatsRef.doc(enotherChatId);

        chatDocRef.get().then((doc) => {
          if (doc.exists) {
            console.log("Document exists 1");
            store.commit("chat/setChatId", enotherChatId);
            store.commit("chat/setSelectedUser", userId2);
          } else {
            const chatDocRefSecond = chatsRef.doc(chatId);

            chatDocRefSecond.get().then((doc) => {
              if (doc.exists) {
                console.log("Document exists 2");
                store.commit("chat/setChatId", chatId);
                store.commit("chat/setSelectedUser", userId2);
              } else {
                async function createChatWithFirstMessage() {
                  const db = firebase.firestore();
                  const batch = writeBatch(db);

                  // const chatRef = db.collection("chats").doc(chatId);

                  // const chatsMsgsRef = db
                  //   .collection("chatMessages")
                  //   .doc(chatId);

                  // batch.set(chatsMsgsRef, { messages: [message] });


                  const messagesRef = db
                    .collection("chatMessages")
                    .doc(chatId)
                    .collection("messages");
                    batch.set(messagesRef.doc(), message);

                  const lastMsg = {
                    text: v,
                    createdAt: message.createdAt,
                    from: message.userName,
                  };

                  // batch.set(chatRef, chatData);
                  // Step 1: Add the unique ID to the `chats` array in both users' documents.
                  batch.update(
                    user1Ref,
                    {
                      [chatId]: {
                        id: chatId,
                        lastMsg,
                      },
                    }
                    // chats: firebase.firestore.FieldValue.arrayUnion(chatData),
                  );

                  batch.update(user2Ref, {
                    // chats: firebase.firestore.FieldValue.arrayUnion(chatData),
                    [chatId]: {
                      id: chatId,
                      lastMsg,
                    },
                  });

                  // Step 2: Use the unique ID as the name of a new document in the `chats` collection.

                  // Wait for both update operations to complete before committing the batch.

                  await batch
                    .commit()
                    .then(() => {
                      console.log("Batch operation successful");
                      store.commit("chat/setChatId", chatId);
                      store.commit("chat/setSelectedUser", userId2);
                    })
                    .catch((error) => {
                      console.error("Batch operation failed:", error);
                    });
                }

                createChatWithFirstMessage();
              }
            });
          }
        });
      }
    }

    return {
      sendMessageToFoundedChat,
    };
  },
};
</script>

<style lang="scss" scoped>
.new-chat {
  padding-top: 170px;

  h2 {
    color: #393939;
  }
}
</style>
