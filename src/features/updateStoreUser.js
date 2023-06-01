
import store from "@/store/store";
import firebase from "firebase/compat/app";
import { doc, getDoc } from "firebase/firestore";


export async function updateStoreUser(id) {
    
    const db = firebase.firestore();
    const prewuserSnapRef = doc(db, "usersPrew", id ? id : store.state.user.user.uid);
    const prewuserSnap = await getDoc(prewuserSnapRef);

    console.log(prewuserSnap.data(), "USER");
    store.commit("user/setUser", prewuserSnap.data());
  }


