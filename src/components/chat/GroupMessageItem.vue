<template>
  <div ref="msg" :class="{ 'my-item': isMy }" class="item">
    <div v-on:click.right="(e) => handleSelectMsg(e)" class="item-body">
      <div class="item_body_text">
        <p>{{ message.text }}</p>
        <p class="time">{{ time }}</p>
      </div>

      <div class="emoji-wrap" v-if="emojis">
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
      </div>
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



.item {
  min-width: 150px;
  max-width: 900px;
  width: 500px;
  position: relative;
  display: flex;
  

  .item-body {
    width: 100%;
    left: 0px;
    display: flex;
    flex-direction: column;
    text-align: left;
    margin-top: 0px;
    padding-left: 6px;
    padding-right: 35px;
    z-index: 3;

    .item_body_text {
      font-size: 0.9rem;
      margin-top: 0px;
      padding-left: 6px;
      padding-right: 35px;
      p {
        font-weight: 200;
      }

      .time {
        position: absolute;
        right: 10px;
        font-size: 0.7rem;
      }
    }

    padding: 8px;
    background: $content-main;
    color: $text-main;
    margin-bottom: 2px;

    flex-wrap: wrap;
    position: relative;

    display: inline-block;

    margin-left: 10px;
    max-width: 500px;
    word-break: break-all;
    overflow-wrap: break-word;
    border-radius: 20px;
    width: max-content;
    min-width: 80px;
    max-width: 70%;
  }

.tail {
  position: absolute;
  height: 20px;
  width: 20px;
  bottom: 2px;
  left: 3px;
  width: 0;
  height: 0;
  border-bottom: 25px solid  $content-main;
  border-left: 25px solid transparent;
  z-index: 1;
}

}

.dark .item {
  .item-body {
    background: $content-main-l;
    color: $text-main-l;

    word-break: break-all;
  }

  .emoji-c {
    background-color: $content-main-l;
    border: 1px solid $main;
  }
}

.item .emoji-c {
  @extend %emoji;
  background-color: $content-main-dark;
  border: 1px solid $content-main-dark;
}

.my-item .emoji-c {
  @extend %emoji;
  background-color: $second;
  border: 1px solid $second;
}

.dark .my-item {
  .emoji-c {
    background-color: $second;
    border: 1px solid $second;
  }
  .item-body {
    background: $main;
    color: white;
  }
}

@media (pointer: coarse) {
  //tch sreen
  .my-item {
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
  }

  .item {
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
  }
}

.my-item {
  transform: translateX(0px);
  transition: transform 0.2s ease-out;
  max-width: 600px;
  position: relative;
  width: max-content;
  display: flex;

  .item-body {
    right: 0px;
    padding-right: 10px;
    .item_body_text {
      text-align: left;
      font-size: 0.9rem;
      margin-top: 0px;
      padding-left: 6px;
      padding-right: 35px;
    }
    .user-name {
      display: none;
    }

    color: white;
    background: $main;

    right: 0px;
    margin-left: 10px;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    width: auto;
    line-height: 19px;

  }

.tail {
  border-bottom: 25px solid  $main;
}

}

@media (max-width: 1115px) {
  .my-item {
    right: 0%;
  }
}

@media (max-width: 910px) {
  .my-item {
    width: min-content;
    display: flex;
    max-width: 500px;
    .item-body {
      right: 0px;
      .item_body_text {
        text-align: left;
        font-size: 0.9rem;
        margin-top: 0px;
        padding-left: 6px;
        padding-right: 35px;
      }
      .user-name {
        display: none;
      }
      word-break: break-all;
      padding: 8px;
      color: white;
      display: flex;

      flex-wrap: wrap;
      position: relative;
      right: 0px;
      margin-left: 10px;
      width: max-content;

      line-height: 19px;
    }
  }

  @media (max-width: 500px) {
    .my-item {
      width: min-content;
      display: flex;
      max-width: 350px;
    }
  }

  @media (max-width: 440px) {
    .my-item {
      width: min-content;
      display: flex;
      max-width: 320px;
    }
  }
}
</style>
