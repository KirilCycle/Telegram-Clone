import { userModule } from "@/store/userModule";
import { createStore } from "vuex";

export default createStore({
  modules: {
    user: userModule
  },
});
