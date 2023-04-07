<template>
  <div v-show="isVisible" @click="$store.commit('chat/setSelectedUser', enotherUser)">
    
    <chat-item :time="time" :id="chat.id" v-show="!loading" :pthUrl="enotherUser?.photoURL">
     
        <h3>{{ chatName }}</h3>

        <p>{{ chat?.lastMsg?.text }}</p>
     
    </chat-item>
  
  </div>
</template>

<script>
import firebase from "firebase/compat/app";
import store from "@/store/store";
import ChatItem from "./ChatItem.vue";

export default {
  props: {
    chat: Object,
  },
  components: {
    ChatItem,
  },
  data() {
    return {
      loading: true,
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
    time() {
      let date = new Date( this.chat.lastMsg?.createdAt.seconds * 1000);

      let hours = date.getHours();

      let minutes = + date.getMinutes();

      return `${hours}:${minutes}` 
     
    }
  },

  methods: {
  
    async fethcEnotherUser() {

      this.loading = true
      const myCollectionRef = this.db.collection("usersPrew");
      const documentRef = myCollectionRef.doc( this.chat.id.replace(store.state.user.user.uid, '') );
      // Retrieve the document using the get() method
      documentRef
        .get()
        .then((doc) => {
          this.enotherUser = doc.data();
          let us = this.enotherUser;

          if (us?.displayName) {
            this.chatName = us.displayName;
          }
          // console.log(this.enotherUser, 'us');
          this.chatName = us.email.slice(0,us.email.indexOf('@'));
          
      console.log(    this.enotherUser, 'US');

      this.loading = false

        })
        .catch((error) => {
          console.log("Error getting user:", error);
        });
    },
  },
  created() {
    this.fethcEnotherUser()
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
    font-size: 1rem;
    font-weight: 550;
  
  }
  p {
    font-size: 0.8rem;
    white-space: nowrap;

  }
}
</style>
