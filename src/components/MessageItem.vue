<template>
  <div ref="msg" :class="{ 'my-item': isMy }" class="item">
   <!-- <p>
     @touchend="stop"
      @touchstart="(e) => start(e, handleTouch)"
      @touchmove="(e) => touchMoveHandle(e)"
   </p> -->
    <div
      v-on:click.right="(e) => handleSelectMsg(e)"
      @contextmenu.prevent="messageActions"
      class="item-body"
    >
      <div v-if="message.sender" class="forward">
        <p>Forwarded message</p>
        <h4 @click="() => handle(message.sender.userId)">
          {{ message.sender?.userName }}
        </h4>
      </div>

      <message-source-container-vue
        v-if="message.source"
        :source="message.source"
      ></message-source-container-vue>

      <div class="reply-block" v-if="message.replyData">
        <div class="reply_block_source_wrap" v-if="message.replyData.source">
          <small-chat-image
            :type="message.replyData.source.type"
            :src="message.replyData.source.src"
          ></small-chat-image>
        </div>

        <div class="reply_block_text_wrap">
          <h3>{{ message.replyData.from }}</h3>
          <p>{{ message.replyData.text }}</p>
        </div>
      </div>

      <div class="item_body_text">
        <p>{{ message.text }}</p>
        <p class="time">{{ time }}</p>
      </div>

      <div class="emoji-wrap" v-if="emojis">
        <div
          @click="() => replyEmoji(em[0], message)"
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
  </div>
</template>

<script>
import { ref } from "vue";
import store from "@/store/store";
import { getAuth } from "firebase/auth";
import ProfileImage from "./ProfileImage.vue";
import SmallChatImage from "./SmallChatImage.vue";
import EmojiContainer from "./EmojiContainer.vue";
import { objectEntries } from "@vueuse/core";
import EmojiUser from "./EmojiUser.vue";
import { replyEmoji } from "@/features/replyUsingEmoji";
import MessageSourceContainerVue from "./chat/MessageSourceContainer.vue";

export default {
  components: {
    ProfileImage,
    MessageSourceContainerVue,
    SmallChatImage,
    EmojiContainer,
    EmojiUser,
  },

  props: {
    message: Object,
    isMy: Boolean,
    removeMessage: Function,
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
    const auth = getAuth();

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
      auth,
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
  cursor: pointer;
  align-items: center;
}

.emoji-wrap {
  max-width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  @extend %no-select;
}
.item {
  position: relative;
  display: flex;

  .reply-block {
    max-width: 93%;
    max-height: 38px;
    display: flex;
    flex-direction: row;
    margin-left: 7px;
    padding-left: 2px;
    overflow: hidden;
    border-left: #fff 3px solid;

    .reply_block_source_wrap {
      width: 20px;
      height: 100%;
      display: flex;
    }

    .reply_block_text_wrap {
      width: auto;
      margin-left: 3px;
      max-width: 70px;
      height: 100%;
      h3 {
        font-size: 0.85rem;
        line-height: normal;
      }
      p {
        color: #d7d7d7;
        font-size: 0.75rem;
      }
    }
  }

  .item-body {
    left: 0px;
    display: flex;
    flex-direction: column;
    text-align: left;
    margin-top: 0px;



    .item_body_text {
      font-size: 0.9rem;
      line-height: 22px;
      margin-top: 0px;
      padding-left: 6px;
      padding-right: 6px;
      p {
        font-weight: 200;
      }

      .time {
        display: block;
        position: absolute;
        right: 10px;
        flex-shrink: 0;
        font-size: 0.7rem;
      }
    }

    padding-top: 8px;
    padding-bottom: 8px ;
    background: $content-main;
    color: $text-main;
    margin-bottom: 7px;
    position: relative;
    overflow-wrap: break-word;
    display: inline-block;
    margin-left: 10px;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    border-top-left-radius: 20px;
    max-width: 500px;
    width: auto;
  }
}

.dark .item {
  .item-body {
    background: $content-main-l;
    color: $text-main-l;
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
  position: relative;
  display: flex;

  .item-body {
    .item_body_text {
      text-align: left;
      font-size: 0.9rem;
      margin-top: 0px;
      padding-left: 6px;
      padding-right: 6px;
      width: 100%;
    }
    .user-name {
      display: none;
    }

    color: white;
    background: rgb(84, 175, 213);
    width: auto;
    margin-left: 10px;
  }
}

@media (max-width: 925px) {
  .item {
    .item-body {
      max-width: 400px;
    }
  }
}

@media (max-width: 455px) {
  .item {
    .item-body {
      max-width: 320px;
    }
  }
}

@media (max-width: 370px) {
  .item {
    .item-body {
      max-width: 270px;
    }
  }
}

.forward {
  p {
    font-size: 0.8rem;
  }
  h4 {
    font-size: 0.9rem;
    cursor: pointer;
  }
}
</style>
