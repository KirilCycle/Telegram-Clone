import firebase from "firebase/compat/app";
import store from "@/store/store";

export default function useValidationFeatures() {
  function googleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((res) => {
        store.commit("user/setAuth", true);
        store.commit("user/setUser", res.user);
        router.push({ name: "chat" });
      })
      .catch((e) => alert(er));
  }

  function handleVisible(value) {
    value === "password"
      ? (value = "text")
      : (value = "password");
  }

  return {
    googleSignIn,
    handleVisible
  };
}
