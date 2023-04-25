<template>
  <div class="wrp">
    <div v-observer="fetchPrev"></div>

    <sub-chat
      @dataToNextMove="addDataToGetOtherSubChats"
      :getData="subCht"
      v-for="subCht in subChats"
      :key="subCht"
    ></sub-chat>

    <div class="bottom" ref="bottom">
      <div v-observer="fetchNext"></div>
    </div>
  </div>
</template>

<script>
import { collection, getDocs, getDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import store from "@/store/store";
import { onBeforeUpdate, ref, watchEffect } from "vue";
import { getDatabase, onValue } from "firebase/database";
import { updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import ChatInput from "./ChatInput.vue";
import MessageItem from "./MessageItem.vue";
import { query, orderBy, startAt, endBefore } from "firebase/firestore";
import { onMounted } from "vue";
import { limitToFirst, limitToLast, startAfter } from "firebase/database";
import SubChat from "./SubChat.vue";
import { uuidv4 } from "@firebase/util";

export default {
  components: { ChatInput, MessageItem, SubChat },
  props: {
    chatId: Array,
    sendMsg: Function,
    required: true,
  },
  components: {
    SubChat,
  },
  data() {
    return {
      sendMsg: this.sendMsg,
      firstPartOfmyId: store.state.user.user.uid.slice(0, 10),
    };
  },
  methods: {},
  setup(props) {
    const chat = ref([]);
    const bottom = ref(null);
    const db = firebase.firestore();

    const disablePrevFetch = ref(null);
    const chatWasFetched = ref(null);
    const page = ref(null);
    
    const prevData = ref(null);
    
    const subChats = ref([]);

    const messagesRef = ref(
      db
        .collection("chatMessages")
        .doc(store.state.chat.chatId)
        .collection("messages")
    );

    const query = ref(null);

    async function startChatConverstion() {
      try {
        query.value = messagesRef.value.orderBy("createdAt","desc").limit(20);

       
        query.value.onSnapshot((snapshot, parameters) => {
          const first = {
            id: snapshot.docs[19],
            ...snapshot.docs[19].data(),
          };

          const subChat = {
            type: "startAfter",
            localId: uuidv4(),
            opirniy: first,
            last: null,
            first: null,
          };
          
          subChats.value.push(subChat);

          console.log(first);


        });
      } catch (e) {
        console.log(e, "AT FIRST TRY TO GET CONVERSATION");
      }
    }

    // let subChat = {
    //   type: "none",
    //   localId: uuidv4(),
    //   opirniy: 10,
    //   last: null,
    //   first: null,
    // };

    // subChats.value.push(subChat);
    // subChats.value.push(subChat1);
    // subChats.value.push(subChat2);

    const firstWas = ref(null)

    watchEffect(async () => {
      if (!prevData.value) {
        //chat was at first opened

        if (!firstWas.value ) {
          startChatConverstion().then((res) => firstWas.value = true)
        }
        console.log(  'AAAAAAA');
         
      }
    });

    function fetchPrev() {
      //chat will have 3 sub chats
      //in case we have 3 i will push next based first msg
      //and delete last
      if ( subChats.value[0].first) {
        console.log(subChats.value[0].first,"get previous");
  
        subChats.value.unshift({
          type: "endBefore",
          localId: uuidv4(),
          opirniy: subChats.value[0].first,
          last: null,
          first: null,
        });
  
        // console.log(subChats.value);

      }
      
    }

    function addDataToGetOtherSubChats(first, last, localId) {
      for (let i = 0; i < subChats.value.length; i++) {
        if (subChats.value[i].localId === localId) {
          subChats.value[i].last = last;
          subChats.value[i].first = first;
        }

        console.log("get from");
      }
    }

    function fetchNext() {
      console.log("get last");
    }
    return {
      subChats,
      fetchPrev,
      fetchNext,
      addDataToGetOtherSubChats,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
</style>
