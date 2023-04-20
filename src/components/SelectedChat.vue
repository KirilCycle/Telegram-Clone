<template>
  <div class="wrp">
    <div v-observer="fetchPrev"></div>

    <div v-if="page > 0" class="bottom" ref="bottom">
      <div v-observer="fetchNext"></div>
    </div>

    <selected-chat-part :nextstart="null" :nextend="null" :start="third" :end="fourt" :chatId="id"></selected-chat-part>
    <selected-chat-part :nextstart="nextstart" :nextend="nextend" :start="first" :end="second" :chatId="id"></selected-chat-part>

    <div class="bottom" ref="bottom">
        <div v-observer="fetchNext"></div>
    </div>
    <!-- <div  v-if="page < 0" class="bottom" ref="bottom">
      <div v-desapeared="disableAutoScroll"></div>
    </div> -->
    <!-- <chat-input :sendMsg="addNewMessage"></chat-input> -->
  </div>
</template>

<script>
import { collection, getDocs, getDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import store from "@/store/store";
import { onBeforeUpdate, ref, watchEffect, computed } from "vue";
import { getDatabase, onValue } from "firebase/database";
import { updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import ChatInput from "./ChatInput.vue";
import MessageItem from "./MessageItem.vue";
import { query, orderBy, startAt, endBefore } from "firebase/firestore";
import { onMounted } from "vue";
import { limitToFirst, limitToLast, startAfter } from "firebase/database";
import SelectedChatPart from "@/components/SelectedChatPart.vue";
import { useDark, useToggle } from "@vueuse/core";

export default {
  components: { ChatInput, MessageItem, SelectedChatPart },
  props: {
    chatId: Array,
    sendMsg: Function,
    required: true,
  },

  data() {
    return {};
  },
  methods: {},
  mounted() {},

  setup(props) {
    const bottom = ref(null);

    //middle msg item

    // const slectedChatRef = db.collection("chatMessages");

    const chasingBottom = ref(true);
    function scrollToBottom() {
      bottom.value?.scrollIntoView({ behavior: "smooth", block: "end" });
    }

    function disableAutoScroll(v) {
      chasingBottom.value = v;
    }

    //  <div v-for="txt in chat.messages" :key="txt">{{ txt }}</div>

    // watchEffect(() => {
    //   let link = store.state.chat.chatsScrollPosition[store.state.chat.chatId];

    //   page.value = link.page;
    //   pivot.value = link.pivot;

    //   console.log("SETUP", link);

    // });


    const fourtRef = ref('ddd')
    const thirdRef = ref('ccc')
   
    const secondRef= ref('bbb')
    const firstRef = ref('aaa')

    const fourtTmp = ref(null)
    const thirdTmp = ref(null)

   

    watchEffect(() => {});

    function fetchPrev() {
        fourtTmp.value = fourt.value
        thirdTmp.value = third.value

        firstRef.value = third.value
        secondRef.value = fourt.value

        fourtRef.value =  Math.floor(Math.random() * 100000000)
        thirdRef.value =  Math.floor(Math.random() * 100000000)

       
    }

    function fetchNext() {
      
    }

  
    const id = ref(store.state.chat.chatId)

    const first = computed(() => firstRef.value);
    const second = computed(() => secondRef.value);
    const third = computed(() => thirdRef.value);
    const fourt = computed(() => fourtRef.value);

    const nextend = computed(() => fourtTmp.value)
    const nextstart = computed(() => thirdTmp.value)

    return {
      
        //   firstScroll,
      nextend,
      nextstart,
      fourt,
      second,
      third,
      first,
      fetchPrev,
      fetchNext,
      bottom,
      disableAutoScroll,
      chasingBottom,
      scrollToBottom,
      id
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/colors.scss";

.sm {
  height: 1000px;
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.scrl-to-btm-btn {
  &:hover {
    background-color: #313131;
  }
  width: 45px;
  height: 45px;
  background-color: $content-main;
  border-radius: 22.5px;
  position: fixed;
  bottom: 20%;
  cursor: pointer;
  z-index: 30;
  display: block;
  right: 5px;
  color: rgb(68, 134, 255);
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    font-size: 2rem;
  }
}

.dark .scrl-to-btm-btn {
  background-color: $content-main-l;
}

nav {
  width: 100%;
  padding: 5px;
  height: 7%;
  display: flex;
  flex-direction: row;
  background-color: #1d1e2a;
}

.bottom {
  height: 49px;
  width: 100%;
  bottom: 0;
  position: relative;
  z-index: -1;

  div {
    width: 100%;
    bottom: 50px;
    height: 50px;

    position: absolute;
    z-index: 20;
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.wrp {
  padding-top: 30px;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
}

@media (pointer: coarse) {
  //tch sreen

  .wrp {
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
  }
}

.chat {
  width: 100%;
}
</style>
