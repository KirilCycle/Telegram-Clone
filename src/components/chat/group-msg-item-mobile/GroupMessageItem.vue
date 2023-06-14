<template>
  <div id="touch-area" ref="msg" class="message-wrap">
    <div
      v-on:click="handleSelectMsg"
      class="message"
      :class="{ 'my-message': isMy }"
    >
      <message-source-container-vue
        v-if="message.source"
        :source="message.source"
      >
      </message-source-container-vue>
      <div v-if="message.sender" class="forward">
        <p>Forwarded message</p>
        <h4>
          {{ message.sender?.userName }}
        </h4>
      </div>

      <div class="reply-block" v-if="message.replyData">
        <div class="reply_block_source_wrap" v-if="message.replyData.source">
          <small-chat-image-vue
            :type="message.replyData.source.type"
            :src="message.replyData.source.src"
          ></small-chat-image-vue>
        </div>

        <div class="reply_block_text_wrap">
          <h3>{{ message.replyData.from }}</h3>
          <p>{{ message.replyData.text }}</p>
        </div>
      </div>

      <p class="text">{{ message.text }}</p>

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
          <p v-if="em[1].length > 3">{{ em[1].length }}</p>
          <emoji-user
            v-else
            :key="id"
            v-for="id in em[1]"
            :senderid="id"
          ></emoji-user>
        </div>
      </div>
    </div>
    <span
      v-show="groupRole === 'close'"
      :class="{ 'tail-left': !isMy, 'tail-right': isMy }"
    ></span>
  </div>
  <div v-show="groupRole === 'close'" class="group-space"></div>
</template>

<script>
import { ref } from "vue";
import store from "@/store/store";
import EmojiUser from "../../EmojiUser.vue";
import { replyEmoji } from "@/features/replyUsingEmoji";
import { objectEntries, useSwipe } from "@vueuse/core";
import MessageSourceContainerVue from "../MessageSourceContainer.vue";
import SmallChatImageVue from "../../SmallChatImage.vue";

export default {
  components: {
    EmojiUser,
    MessageSourceContainerVue,
    SmallChatImageVue,
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
      myTail: "my-tail",
      tail: "tail",
      startX: null,
      startY: null,
      msgIsHooked: null,
      cont: 0,
      isReplyMovement: null,
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
  mounted() {
    this.setListeners();
  },
  methods: {
    handleEmojiClick(emj) {
      console.log(emj);
    },

    setListeners() {
      const ref = this.$refs.msg;
      ref.addEventListener("touchmove", this.handleTouchMove, {
        passive: true,
      });
      ref.addEventListener("touchstart", this.handleTouchStart, {
        passive: true,
      });
      ref.addEventListener("touchend", this.handleTouchEnd, { passive: true });
    },

    handleTouchStart(event) {
      // Store the initial touch position
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
    },

    handleTouchMove(event) {
      // Calculate the horizontal distance between the initial touch position and the current touch position
      const currentX = event.touches[0].clientX;
      const currentY = event.touches[0].clientY;
      const deltaX = this.startX - currentX;
      const deltaY = this.startY - currentY;

      const verify = this.msgIsHooked ? true : deltaY >= -10 && deltaY <= 10;

      let verify2;

      if (deltaX < 100) {
        this.isReplyMovement = false;
        verify2 = true;
      } else {
        this.isReplyMovement = true;
        verify2 = false;
      }
      // Check if the touch movement is towards the left side and ignore case where we trying scroll at Y crd
      if (deltaX > 10 && verify2 && verify) {
        this.$refs.msg.style.transform = `translateX(${-deltaX}px)`;
        this.$refs.msg.style.transition = `none`;
        // Perform the desired action for left movement

        this.msgIsHooked = true;
      }

      //  console.log(  number ,min,  max,      number >= min , number <= max);
    },
    handleTouchEnd() {
      this.msgIsHooked = false;
      this.$refs.msg.style.transform = `translateX(${0}px)`;
      this.$refs.msg.style.transition = ` transform 0.5s ease`;
      if (this.isReplyMovement) {
        const msgData = this.message;

        console.log(msgData, "SSS");

        store.commit("message/setReplyTarget", {
          text: msgData.text,
          from: msgData.userName,
          ...(msgData.source ? { source: msgData.source } : {}),
        });
      }
      this.isReplyMovement = null;
    },
  },

  setup(props) {
    const msg = ref(null);
    const visible = ref(false);

    function handleSelectMsg(event) {
      const clickX = event.clientX || event.touches[0].clientX;
      const clickY = event.clientY || event.touches[0].clientY;

      store.commit("message/setReplyMsgRef");
      store.commit("message/setSelectdMsg", props.message);
      store.commit("message/setVisible", true);
      store.commit("message/setClickCoords", {
        x: clickX,
        y: clickY,
      });

      console.log(store.state.message.selectedMsgData, "SELECTED");
    }

    return {
      // photoSrc,
      handleSelectMsg,
      stop,
      msg,
      visible,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.emoji-wrap {
  max-width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  @extend %no-select;
}

.forward {
  width: max-content;
  max-width: 100%;
  overflow: hidden;
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  color: white;
  font-size: 0.7rem;
  position: relative;
  top: 10px;

  h4 {
    margin-left: 3px;
    font-size: 0.75rem;
    cursor: pointer;
    font-weight: 600;
  }
}

.reply-block {
  width: 100%;
  max-height: 34px;
  display: flex;
  flex-direction: row;
  margin-left: 10px;
  padding-left: 2px;
  margin-right: 10px;
  padding-top: 10px;
  overflow: hidden;

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


%no-select {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}

.emoji-c {
  background-color: rgba(245, 245, 245, 0.175);
  width: max-content;
  padding: 3px;
  height: auto;
  font-size: 17px;
  position: relative;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  align-items: center;
  border-radius: 13px;
  &:hover {
    background-color: #ffffff4e;
  }
}

.emoji-c + .emoji-c {
  margin-left: 2px;
}

.emoji-wrap {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 2px 10px 2px 10px;
  @extend %no-select;
}


.tail-left {
  position: absolute;
  bottom: 1px;
  left: 0px;
  width: 0;
  height: 0;
  border-bottom: 22px solid $content-main;
  border-left: 28px solid transparent;
}

.tail-right {
  width: 0;
  height: 0;
  border-bottom: 20px solid $main;
  border-right: 28px solid transparent;
  position: absolute;
  right: 0px;
  bottom: 1px;
}

.message-wrap {
  width: 100%;
  padding: 1px 10px 1px 10px;
  position: relative;
  box-sizing: border-box;
  transition: transform 0.5s ease;
}

%message-pattern {
  color: rgb(255, 255, 255);
  width: max-content;
  max-width: 500px;
  line-height: 20px;
  text-align: left;
  font-size: 1rem;
  overflow-wrap: break-word;
  word-break: normal;
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  border-radius: 15px;
}

.text {
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  font-family: "Roboto", sans-serif;
}

.message {
  @extend %message-pattern;
  background-color: $content-main;
}

.my-message {
  @extend %message-pattern;
  background-color: $main;
  margin-left: auto;
}

@media (max-width: 650px) {
  .my-message {
    max-width: 400px;
  }

  .message {
    max-width: 400px;
  }
}

@media (max-width: 490px) {
  .my-message {
    max-width: 320px;
  }

  .message {
    max-width: 320px;
  }
}
@media (max-width: 350px) {
  .my-message {
    max-width: 300px;
  }

  .message {
    max-width: 300px;
  }
}

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

.dark .message {
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  background-color: white;
  .text {
    color: black;
  }
}

.dark .my-message {
  background-color: $msg-item-l;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  .text {
    color: black;
  }

  .reply_block_text_wrap {
    h3 {
      font-size: 14px;
    }
    p {
      color: white;
      font-size: 14px;
    }
  }
}

.dark .tail-left {
  border-bottom: 20px solid white;
}
.dark .tail-right {
  border-bottom: 22px solid $msg-item-l;
}


</style>
