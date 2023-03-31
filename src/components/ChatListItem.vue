<template>
  <div @click="$store.commit('chat/setSelectedUser',enotherUser )" v-show="isVisible" >
      <chat-item :pthUrl="`https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/847px-Red_Apple.jpg`">

        <h3>{{ chatName }}</h3>
        <p>{{ item.lastMessage }}</p>
       
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

        this.enotherUserId = this.chatId.replace(store.state.user.user.uid, "");

        this.fethcEnotherUser();
      });
    },

    async fethcEnotherUser() {
      const myCollectionRef = this.db.collection("usersPrew");

      console.log('EXECUTE', this.enotherUserId)

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
.cht-i {
  width: 100%;
  height: 70px;
  display: flex;
  flex-direction: row;

  .img-conatiner {
    padding-left: 5px;
    padding-right: 5px;
    height: 100%;
    flex-shrink: 0;

    .img-wrap {
      margin: 0% auto;
      width: 50px;
      height: 50px;
      background-color: #1875ff;
      border-radius: 50%;
      overflow: hidden;

      img {
        width: 100%;
        min-height: 100%;
        object-fit: cover;
      }
    }
  }

  .chatitem_info_container {
    height: 100%;
    padding: 5px;
    display: flex;
    flex-direction: column;
    text-align: left;

    h3 {
      font-size: 0.9rem;
      font-weight: 550;
      color: white;
    }
    p {
      font-size: 0.8rem;
      color: #616161;
    }
  }
}
</style>
