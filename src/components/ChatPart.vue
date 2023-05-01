<template>
  <div class="chat-part">
    <div v-for="message in chat" :key="message.id" class="msg">
      {{ message }}
    </div>
  </div>
</template>

<script>
import { collection, getDocs, getDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import store from "@/store/store";
import { onBeforeUpdate, ref, onMounted, computed, watchEffect } from "vue";
import { getDatabase, onValue } from "firebase/database";
import { updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import ChatInput from "./ChatInput.vue";
import MessageItem from "./MessageItem.vue";
import { query, orderBy, startAt, endBefore } from "firebase/firestore";
import { scrollTo } from "vue-scrollto";
import { limitToFirst, limitToLast, startAfter } from "firebase/database";
import MessagesSkelet from "./MessagesSkelet.vue";

// id: uuidv4(),
//         howGet:  {action:'startAfter', message: 222 },
//         topMessage: null,
//         bottomMessage: null,

export default {
  props: {
    settings: Object,
  },
  setup(props, { emit }) {
    const chat = ref([]);

    let query;

    onMounted(() => {
      //setting query
    });

    for (let i = 0; i < 12; i++) {
      chat.value.push( i + " " + props.settings.id.slice(0, 5));
    }

    emit("updated", {
      id: props.settings.id,
      topMessage: chat.value[0],
      bottomMessage: chat.value[chat.value.length - 1],
    });

    return {
      chat,
    };
  },
};
</script>

<style lang="scss" scoped>
.msg {
  width: 300px;
  margin-top: 10px;
  margin-bottom: 10px;
  height: 120px;
  background-color: rgb(93, 145, 241);
}
.chat-part {
  margin: 7px 0px 7px 0px;
  width: 100%;
  border: 3px solid rgb(98, 117, 135);
}
</style>
