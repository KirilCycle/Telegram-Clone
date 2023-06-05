import { Timestamp } from "firebase/firestore";
import firebase from "firebase/compat/app";
import store from "@/store/store";
import { doc, writeBatch } from "firebase/firestore";
import { getUser } from "@/features/getUser"
import { getAuth } from "firebase/auth";


export async function sendMessageToFoundedChat(v, toUserId ,source) {
    const db = firebase.firestore()
    const nextVerify = v.length > 0 || source;
    const auth = getAuth();

    if (toUserId && v.length < 2000 && nextVerify) {
      const userId1 = auth.currentUser.uid;
      const userId2 = toUserId;

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

        // createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };
      if (auth.currentUser.photoURL) {
        message.userPhotoURl = auth.currentUser.photoURL;
      }

      if (source) {
        message.source = source;
      }

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
                    getUser(userId2).then((response) =>
                      store.commit("chat/setSelectedUser", response)
                    );
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