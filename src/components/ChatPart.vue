<template>
    <div class="chat-part">
        <div v-for="message in chat" :key="message.id" class="msg">
            {{ message.text }}
        </div>
    </div>
</template>

<script>
import { collection, getDocs, getDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import store from "@/store/store";
import { onBeforeUpdate, ref, computed, watchEffect } from "vue";
import { getDatabase, onValue } from "firebase/database";
import { updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import ChatInput from "./ChatInput.vue";
import MessageItem from "./MessageItem.vue";
import { query, orderBy, startAt, endBefore } from "firebase/firestore";
import { scrollTo } from "vue-scrollto";
import { onMounted } from "vue";
import { limitToFirst, limitToLast, startAfter } from "firebase/database";
import MessagesSkelet from "./MessagesSkelet.vue";


    export default {
        data() {

        },

        setup() {
            const chat =  ref(null)
            


 
            return { 
                chat
            }
        }
    }
</script>

<style lang="scss" scoped>

.msg {
    width: 300px;
    height: 70px;
    background-color: rgb(5, 31, 85);
}
.chat-part {
    width: 100%;
    border: 3px solid rebeccapurple; 
}
</style>