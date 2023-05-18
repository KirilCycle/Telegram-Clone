<template>
    <div class="search-info-wrap">
      <p>Global search</p>
    </div>
    <div class="global-users-wrap">
      <chat-item
        :pthUrl="us.photoURL"
        @click="() => handle(us)"
        v-for="us in founded"
        :key="us.uid"
      >
        <template v-slot:name>
          <h3>
            {{
              us.displayName
                ? us.displayName
                : us.email.replace("@gmail.com", "")
            }}
          </h3>
        </template>
        <template v-slot:last_msg>
          <p class="username-text">
            {{ "@" + us.username }}
          </p>
        </template>
      </chat-item>
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
  computed: {},

  setup() {
    console.log(store.state.chat.querry);

    const founded = ref([]);

    const db = firebase.firestore();

    watchEffect(() => {
      if (store.state.chat.query && store.state.chat.query.length > 3 ) {
        const filteredSearchQuerry = store.state.chat.query.replaceAll("@", "");

        const query = db
          .collection("usersPrew")
          .where("username", ">=", filteredSearchQuerry)
          .where("username", "<=", filteredSearchQuerry + "z")
          .limit(10);

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
      }
    });

    function selectedUser(us) {
      const modiffied = us;
      modiffied.new = true;
      store.commit("chat/setSelectedUser", modiffied);
      store.commit("chat/setChatId", null);
    }

    function handle(us) {
      const first = us.uid + store.state.user.user.uid;

      const second = store.state.user.user.uid + us.uid;

      console.log("handle us ", store.state.chat.chatIdList);

      if (store.state.chat.chatIdList) {
        if (store.state.chat.chatIdList.find((ch) => ch.id === first)) {
          store.commit("chat/setSelectedUser", us);
          store.commit("chat/setChatId", first);
        } else if (store.state.chat.chatIdList.find((ch) => ch.id === second)) {
          store.commit("chat/setSelectedUser", us);
          store.commit("chat/setChatId", second);
        } else {
          selectedUser(us);
        }
      } else {
        selectedUser(us);
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
@import "@/styles/colors";

h3 {
  font-size: 0.9rem;
  font-weight: 550;
  color: $text-main;
}

.dark h3 {
  color: $text-main-l;
}



.username-text {
  font-size: 0.8rem;
  color: #448fff;
}

.text-container {
  text-align: left;
}

.search-info-wrap {
  background-color:  $main;
  padding: 5px;
  color: white;
  text-align: left;
}
</style>
