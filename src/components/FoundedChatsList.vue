<template>
  <div>
    <div>
      <div
        @click="$store.commit('chat/setSelectedUser', us)"
        v-for="us in founded"
        :key="us.uid"
      >
        <p>
          {{ us.email }}
        </p>
      </div>
    </div>
    items
  </div>
</template>

<script>
import { collection, getDocs, getDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import store from "@/store/store";
import { ref } from "vue";
import {  watchEffect } from 'vue';
import { getDatabase, onValue } from "firebase/database";
import { updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import DirectChat from "@/components/DirectChat.vue";
export default {
  data() {
    return {};
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
          .limit(4);
  
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
      


    })


    return {
      founded,
    };
  },
};
</script>

<style lang="scss" scoped></style>
