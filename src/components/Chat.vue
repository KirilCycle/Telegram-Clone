<template>
  <div class="chat-wrap">
    <button class="prev" @click="getPrev">show prev</button>

    <chat-part
      @updated="setUpdatedData"
      :settings="part"
      v-for="part in chatPartSettings"
      :key="part.id"
    ></chat-part>

    <button class="next" @click="getNext">show next</button>
  </div>
</template>

<script>
//miracle doesnt exist
// import { collection, getDocs, getDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
// import store from "@/store/store";
// import { getDatabase, onValue } from "firebase/database";
// import { updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
// import { doc, setDoc } from "firebase/firestore";
// import ChatInput from "./ChatInput.vue";
// import MessageItem from "./MessageItem.vue";
// import { query, orderBy, startAt, endBefore } from "firebase/firestore";
// import { scrollTo } from "vue-scrollto";
import { uuidv4 } from "@firebase/util";
// import { onMounted } from "vue";
// import { limitToFirst, limitToLast, startAfter } from "firebase/database";
// import MessagesSkelet from "./MessagesSkelet.vue";
import ChatPart from "./ChatPart.vue";
import { onBeforeUpdate, ref, computed, watchEffect } from "vue";
export default {
  components: {
    ChatPart,
  },

  setup() {
    const db = firebase.firestore();

    const chatPartSettings = ref([]);

    //action startAfter/endBefore
    //

    const chatPartsetting = {
      id: uuidv4(),
      howGet: { action: "endBefore", message: 111 },
      topMessage: null,
      bottomMessage: null,
    };

    const chatPartsetting2 = {
      id: uuidv4(),
      howGet: { action: "startAfter", message: 222 },
      topMessage: null,
      bottomMessage: null,
    };

    // chatPartSettings.value.unshift(chatPartsetting2)
    chatPartSettings.value.unshift(chatPartsetting);

    function getPrev() {}

    function getNext() {}

    function setUpdatedData(settings) {
      console.log("SET", settings);
     const link = chatPartSettings.value.findIndex((set) => set.id === settings.id )

     chatPartSettings.value[link] = {
        ...chatPartSettings.value[link],
        ...settings
     }

     console.log( chatPartSettings.value)

    }

    return {
      getPrev,
      chatPartSettings,
      getNext,
      setUpdatedData,
    };
  },
};
</script>

<style lang="scss" scoped>
.prev {
  width: 100%;
  height: 50px;
  background-color: #5b42ff;
  color: white;
}
.next {
  @extend .prev;
}
.chat-wrap {
  padding-top: 30px;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  overflow-anchor: none;
}

@media (pointer: coarse) {
  //tch sreen

  .chat-wrap {
    overflow-anchor: none;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
  }
}
</style>
