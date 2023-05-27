import { updateDoc } from "firebase/firestore";
import { deleteDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import store from "@/store/store";

export async function replyEmoji(em, msg, isSelected) {
  //  // set awdawd waa a a a a a a a a a
  // // Set the "capital" field of the city 'DC'
  // await updateDoc(washingtonRef, {
  //   capital: true
  // });
  console.log(em, msg.emj, "START");

  const user = store.state.user.user.uid;

  const db = firebase.firestore();

  let msgRef = db
    .collection("chatMessages")
    .doc(store.state.chat.chatId)
    .collection("messages")
    .doc(msg.id);

  if (msg.emj) {
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

    const emojis = msg.emj;

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
      let source;

      await msgRef.get().then((doc) => {
        source = Object.entries(doc.data().emj);
      });

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
          console.log(founded, em, "DIFF  REM POS??? DEL ");
          return;
        }
        console.log(founded, em, "DIFF  REM POS???");

        removeReaction(founded, last).then(() => {
          postReaction(em);
        });
      } else {
        postReaction(em);
        console.log(founded, em, "DIFF NO F POST ???");
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
}
