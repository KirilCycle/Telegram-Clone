<template>
  <div  class="message-wrap">
   
    <div v-on:click.prevent.right="(e) => handleSelectMsg(e)" class="message" :class="{ 'my-message': isMy }">
    
        <p>{{ message.text }}</p>
        <!-- <p class="time">{{ time }}</p> -->

      <!-- <div class="emoji-wrap" v-if="emojis">
        <div
          class="emoji-c"
          v-for="em in emojis"
          :key="em[0]"
        >
          <p>
            {{ em[0] }}
          </p>
          <emoji-user :key="id" v-for="id in em[1]" :senderid="id"></emoji-user>
        </div>
      </div> -->
    </div>

    <div v-show="groupRole === 'close'" class="tail"></div>
  </div>
  <div v-show="groupRole === 'close'" class="group-space"></div>
</template>

<script>
import { ref } from "vue";
import store from "@/store/store";
import EmojiUser from "../EmojiUser.vue";
import { replyEmoji } from "@/features/replyUsingEmoji";
import { objectEntries } from "@vueuse/core";

export default {
  components: {
    EmojiUser,
  },

  props: {
    message: Object,
    isMy: Boolean,
    groupRole: String,
    required: true,
  },

  data() {
    return {
      replyEmoji,
    };
  },

  computed: {
    time() {
      //test
      let date = new Date(this.message?.createdAt.seconds * 1000);

      let hours = date.getHours();

      let minutes = +date.getMinutes();

      return `${hours}:${
        minutes.toString().length < 2 ? "0" + minutes : minutes
      }`;
    },

    emojis() {
      if (this.message.emj) {
        return objectEntries(this.message.emj);
      }
      return false;
    },
  },

  methods: {
    handleEmojiClick(emj) {
      //find my id and delete here
      //

      console.log(emj);
    },
    handleTouch(e) {
      console.log("TOCUB");

      store.commit("message/setReplyMsgRef", this.$refs.msg);
      // store.commit('message/setClickCoords', {
      //   x: e.clientX,
      //   y: e.clientY
      // } )

      store.commit("message/setSelectdMsg", this.message);

      console.log(store.state.message.selectedMsgData, "SELECTED");

      store.commit("message/setVisible", true);
    },

    handleSelectMsg(e) {
      store.commit("message/setReplyMsgRef", this.$refs.msg);
      store.commit("message/setClickCoords", {
        x: e.clientX,
        y: e.clientY,
      });

      store.commit("message/setSelectdMsg", this.message);
      store.commit("message/setVisible", true);

      console.log(store.state.message.selectedMsgData, "SELECTED");

      //
      // store.commit('message/setReplyTarget',
      //  {
      //    text: this.message.text,
      //    from: this.message.userName,
      //   ...( this.message.imageRef?  {  img:  this.message.imageRef } : {} )
      //  }
      // )
      console.log(store.state.message, "FROM REDUX");
    },
  },

  setup(props) {
    const myTimeout = ref(null);

    function start(e, execute) {
      myTimeout.value = setTimeout(() => execute(e), 600);
    }

    function stop() {
      clearTimeout(myTimeout.value);
    }

    const msg = ref(null);

    function touchMoveHandle(e) {
      clearTimeout(myTimeout.value);

      let elementPosition = msg.value.clientX;
      // msg.value.style.transform = `translateX(${ msg.value.offsetWidth  }px)`
      console.log(elementPosition);
    }

    const visible = ref(false);

    return {
      // photoSrc,
      stop,
      touchMoveHandle,
      msg,
      open,
      start,
      visible,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

%no-select {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}

%emoji {
  width: max-content;
  padding: 1px;
  height: auto;
  position: relative;
  border-radius: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.group-space {
  height: 10px;
}

.emoji-wrap {
  max-width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  @extend %no-select;
}


</style>
