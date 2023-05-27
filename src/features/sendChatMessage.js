import { Timestamp } from "firebase/firestore";
import firebase from "firebase/compat/app";
import store from "@/store/store";
import { updateDoc,   } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

 
 export async function sendMsg(text, source, replyData, chatId) {
      const db = firebase.firestore();

      const auth = getAuth();

      const nextVerify = text.length > 0 || source;

      if (text.length < 2000 && nextVerify) {
         const message = {
          userName: auth.currentUser.displayName
            ? auth.currentUser.displayName.slice(0, 25)
            : auth.currentUser.email.slice(
                0,
                auth.currentUser.email.indexOf("@")
              ),
          userId: auth.currentUser.uid,
          text,
          createdAt: Timestamp.now(),
          // createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        };
     
        if (source) {
          //   messageisNotReady.value = true;
          message.source = source;
        }

        if (replyData) {
          message.replyData = replyData;
        }

        const chatRefMsg = db
          .collection("chatMessages")
          .doc(chatId)
          .collection("messages");

        console.log(chatRefMsg, "AS SEND");

        chatRefMsg.add(message).then((res) => console.log("res", res));

        const user1usersChatRef = doc(
          db,
          "usersLinksToChat",
          auth.currentUser.uid
        );
        const user2usersChatRef = doc(
          db,
          "usersLinksToChat",
          chatId.replace(auth.currentUser.uid, "")
        );

        const lastMsgData = {
          text,
          createdAt: message.createdAt,
          from: message.userName,
        };

        await updateDoc(user1usersChatRef, {
          [chatId]: {
            lastMsg: lastMsgData,
            id:chatId,
          },
        });

        await updateDoc(user2usersChatRef, {
          [chatId]: {
            lastMsg: lastMsgData,
            id: chatId,
          },
        });

        //set this chat id at the first position on both users
        //i cnat manipulate with index directly
      }
    }

   