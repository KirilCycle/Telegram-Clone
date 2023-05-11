<template>
  <div class="previos-observer" v-observer="previous"></div>
  <messages-list
    @update="handleNewData"
    :settigns="chat"
    v-for="chat in chatSettings"
    :key="chat.id"
  ></messages-list>
  <div class="next" v-observer="next"></div>
</template>

<script>
import { onMounted, watchEffect } from "vue";
import firebase from "firebase/compat/app";
import { ref } from "vue";
import { query, orderBy, startAt, endBefore } from "firebase/firestore";
import store from "@/store/store";
import { uuidv4 } from "@firebase/util";
import MessagesList from "./MessagesList.vue";

export default {
  components: {
    MessagesList,
  },
  setup() {
    const bottom = ref(null);
    const db = firebase.firestore();
    const top = ref(null);
    const gettingType = ref(null);
    const msgs = ref(null);
    const pivotMessage = ref(null);
    const limit = ref(30);
    const chatQuerry = ref(null);
    const chatRef = ref(
      db
        .collection("chatMessages")
        .doc(store.state.chat.chatId)
        .collection("messages")
    );
    const nextSetting = ref({});
    const chatSettings = ref([]);

    onMounted(() => {
      chatSettings.value.push({ type: "start", id: 'start' });
    });

    function handleNewData(middle) {
      nextSetting.value.pivot = middle;
    }

    function previous() {
      console.log("prev");
      chatSettings.value.pop();
      chatSettings.value.push({ ...nextSetting.value, type: "prev",id: uuidv4() });
    }

    

    function next() {
      console.log("prev");
      chatSettings.value.pop();
      chatSettings.value.push({ ...nextSetting.value, type: "next",id: uuidv4()  });
    }

    return {
      bottom,
      previous,
      handleNewData,
      chatSettings,
      msgs,
      next,
      top,
    };
  },
};
</script>

<style lang="scss" scoped>
.msg {
  width: 300px;
  height: 300px;
  background-color: #fff;
}

.previos-observer {
  position: relative;
  top: 730px;
}

.next {
  position: relative;
  bottom: 500px;
  background-color: #fff;
  width: 3px;
}

.msg + .msg {
  margin-top: 3px;
  margin-bottom: 3px;
}
</style>
