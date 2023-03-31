<template>
  <div>
    <div>
      <chat-item
        :pthUrl="us.photoURL"
        @click="() => handle(us)"
        v-for="us in founded"
        :key="us.uid"
      >
        <div class="text-container">
          <h3>
            {{
              us.displayName
                ? us.displayName
                : us.email.replace("@gmail.com", "")
            }}
          </h3>
          <p>
            {{ us.email }}
          </p>
        </div>
      </chat-item>
    </div>
    items
  </div>
</template>

<script>
import { collection, getDocs, getDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import store from "@/store/store";
import { ref } from "vue";
import { watchEffect } from "vue";
import { getDatabase, onValue } from "firebase/database";
import { updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import DirectChat from "@/components/DirectChat.vue";
import ChatItem from "./ChatItem.vue";
export default {
  components: { ChatItem },
  data() {
    return {};
  },
  computed: {
    takeName() {
      if (us.display) {
      }
    },
  },

  setup() {
    console.log(store.state.chat.querry);

    const founded = ref([]);

    const db = firebase.firestore();

    watchEffect(() => {
      const query = db

        .collection("usersPrew")
        .where("email", ">=", store.state.chat.querry)
        .where("email", "<=", store.state.chat.querry + "z")
        .limit(9);

      // Get the query results
      query.get().then((querySnapshot) => {
        const users = [];
        querySnapshot.forEach((doc) => {
          // Get the document data and add it to the users array
          const user = doc.data();
          users.push(user);
        });
        founded.value = users;
        console.log(users, "FROM LIST");
      });
    });

    function handle(us) {
     
      const first =
        us.uid + store.state.user.user.uid
    
      const second =
        store.state.user.user.uid + us.uid
  

      if (store.state.chat.chatIdList.chats.includes(first)) {
        store.commit("chat/setSelectedUser", us);
        store.commit("chat/setChatId",  first);
      } else if (store.state.chat.chatIdList.chats.includes(second)) {
        store.commit("chat/setSelectedUser", us);
        store.commit("chat/setChatId", second);
      } else {
        const modiffied = us
        modiffied.new = true
        store.commit("chat/setSelectedUser", modiffied);
        store.commit("chat/setChatId", null);
      }
    }

    return {
      founded,
      handle,
    };
  },
};
</script>

<style lang="scss" scoped>
h3 {
  font-size: 0.9rem;
  font-weight: 550;
  color: white;
}
p {
  font-size: 0.8rem;
  color: #616161;
}

.text-container {
  text-align: left;
}
</style>
