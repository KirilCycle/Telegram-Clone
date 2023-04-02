<template>
  <div @click="$store.commit('chat/setSelectedUser',enotherUser )" v-show="isVisible" >
      <chat-item :pthUrl="enotherUser.photoURL">

        <div class="txt-container">
        <h3>{{ chatName }}</h3>
          <p>{{ item.lastMessage?.text }}</p>
        </div>
       
      </chat-item>   
  </div>
</template>

<script>
import firebase from "firebase/compat/app";
import store from "@/store/store";
import ChatItem from "./ChatItem.vue";

export default {
  props: {
    chatId: String,
  },
  components: {
    ChatItem
  }, 
  data() {
    return {
      item: {},
      enotherUserId: "",
      enotherUser: {},
      chatName: "",
      db: firebase.firestore(),
    };
  },
  computed: {
    isVisible() {
      if (!store.state.chat.querry) {
        return true;
      } else {
        return this.chatName.includes(store.state.chat.querry);
      }
    },
  },

  methods: {
    async fetchChat() {
      const myCollectionRef = this.db.collection("chats");

      const documentRef = myCollectionRef.doc(this.chatId);

      // Retrieve the document using the get() method
      documentRef.onSnapshot((doc) => {
        this.item = doc.data();
        console.log('EXECUTE', this.item)
        this.enotherUserId = this.chatId.replace(store.state.user.user.uid, "");
        this.fethcEnotherUser();
      });
    },

    async fethcEnotherUser() {
      const myCollectionRef = this.db.collection("usersPrew");

     

      const documentRef = myCollectionRef.doc(this.enotherUserId);

      // Retrieve the document using the get() method
      documentRef
        .get()
        .then((doc) => {
          this.enotherUser = doc.data();

          let us = this.enotherUser;

          if (us?.displayName) {
            this.chatName = us.displayName;
          }
          console.log(this.enotherUser, us)
          this.chatName = us.email?.replace("@gmail.com", "");
        })
        .catch((error) => {
          console.log("Error getting user:", error);
        });
    },
  },
  mounted() {
    this.fetchChat();
  },
};
</script>

<style lang="scss" scoped>


  .chatitem_info_container {
    height: 100%;
    padding: 5px;
    display: flex;
    flex-direction: column;
    text-align: left;

    .txt-container {
      max-width: 100%;
      
      overflow: hidden;
    }

    h3 {
      font-size: 0.9rem;
      font-weight: 550;
      color: white;
    }
    p {
      font-size: 0.8rem;
      white-space: nowrap;
      color: #616161;
    }
  }

</style>
