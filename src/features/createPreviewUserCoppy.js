import { uuidv4 } from "@firebase/util";
import { setDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import { doc, getDoc } from "firebase/firestore";
import "firebase/compat/auth";

export async function createPreviewUserCoppy(user) {
  const db = firebase.firestore();

  await setDoc(doc(db, "usersLinksToChat", user.uid), {}).catch((er) =>
    console.log(er)
  );

  await setDoc(doc(db, "usersPrew", user.uid), {
    uid: user.uid,
    photoURl: `https://robohash.org/${user.uid}.png`,
    email: user.email,
    username: user.email.slice(0, user.email.indexOf("@")) + uuidv4(),
  }).then((res) => {
    return res
  })
}
