import store from "@/store/store";

export async function setUserToStore(user) {
    console.log(user, "USER");
    store.commit("user/setUser", user);
    store.commit("user/setAuth", true);
    console.log("user setted");
  }
  