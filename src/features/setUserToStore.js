import store from "@/store/store";

export async function setUserToStore(user) {
    store.commit("user/setUser", user);
    store.commit("user/setAuth", true);
  }
  