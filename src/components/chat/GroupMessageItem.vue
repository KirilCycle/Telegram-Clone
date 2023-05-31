<template>
  <div ref="msg" class="message-wrap">
    <div
      v-on:click.right="(e) => handleSelectMsg(e)"
      @contextmenu.prevent="messageActions"
      class="message"
      :class="{ 'my-message': isMy }"
    >
      <message-source-container-vue
        v-if="message.source"
        :source="message.source"
      >
      </message-source-container-vue>

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
          <emoji-user :key="id" v-for="id in em[1]" :senderid="id"></emoji-user>
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
import EmojiUser from "../EmojiUser.vue";
import { replyEmoji } from "@/features/replyUsingEmoji";
import { objectEntries } from "@vueuse/core";
import MessageSourceContainerVue from "./MessageSourceContainer.vue";

export default {
  components: {
    EmojiUser,
    MessageSourceContainerVue,
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
      console.log(emj);
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
    },
  },

  setup(props) {
    const msg = ref(null);
    const visible = ref(false);

    return {
      // photoSrc,
      stop,
      msg,
      visible,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
.time {
  cursor: pointer;
  direction: ltr;
  display: inline-flex;
  float: right;
  font-size: 0.7rem;
  line-height: 1;
  pointer-events: none;
  width: 40px;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  vertical-align: middle;
  visibility: hidden;
  z-index: 1;
  color: gray;
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
  cursor: pointer;
  align-items: center;
}

 .emoji-c {
    background-color: $content-main-l;
    border: 1px solid $main;
  }

.emoji-wrap {
  max-width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  @extend %no-select;
}

.inner-time {
  align-items: center;
  bottom: 0;
  display: flex;
  height: 10px;
  line-height: 1;
  padding: inherit;
  pointer-events: all;
  position: absolute;
  right: 0;
  visibility: visible;
  white-space: nowrap;
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
}

%message-pattern {
  color: white;
  padding: 0px 0px 10px 0px;
  width: max-content;
  max-width: 500px;
  line-height: 20px;
  text-align: left;
  font-size: 0.9rem;
  overflow-wrap: break-word;
  word-break: normal;
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  border-radius: 20px;
}

.text {
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
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

@media (max-height) {
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

.emoji-wrap {
  max-width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  @extend %no-select;
}
</style>
