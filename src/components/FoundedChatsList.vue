<template>
  <div>
    <input placeholder="search chats" @input="(e) => searchUsers(e.target.value)" >
    <div>
        <div v-for="us in founded" :key="us.uid">
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
import { getDatabase, onValue } from "firebase/database";
import { updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import DirectChat from "@/components/DirectChat.vue";
export default {
    
    props: {
        searchQ: String,
        required: true
    },

    data() {
        
        return {
         
        }

    },  

    setup() {

    const founded = ref([])

    const q = ref('')

    const db = firebase.firestore();

    function searchUsers (querry) {

        const query = db
        
        .collection("usersPrew")
          .where("email", ">=", querry)
          .where("email", "<=", querry + 'z')
          .limit(4)
    
        // Get the query results
        query.get().then((querySnapshot) => {
            const users = []
            querySnapshot.forEach((doc) => {
            // Get the document data and add it to the users array
            const user = doc.data();
            users.push(user);
          });
          founded.value = users
          console.log(users, 'FROM LIST');
        });
    }


    return {
        q,
        searchUsers,
        founded,
    }

  },
};
</script>

<style lang="scss" scoped></style>
