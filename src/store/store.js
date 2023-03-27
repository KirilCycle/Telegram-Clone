import { userModule } from "@/store/userModule";
import { createStore } from "vuex";
import { chatModule } from "./chatModule";

export default createStore({
  modules: {
    user: userModule,
    chat: chatModule
  },
});
