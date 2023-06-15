<template>
  <div ref="replyBlock" class="conetent">
    <div @click="scrllToTarget" class="target-info">
      <span class="material-symbols-outlined"> reply </span>

      <div v-if="this.$store.state.message.replyTarget?.source">
        <small-chat-image
          :type="this.$store.state.message.replyTarget.source.type"
          :src="this.$store.state.message.replyTarget.source.src"
        ></small-chat-image>
      </div>

      <div class="text-container">
        <h3>{{ select.from || select.sender.userName }}</h3>
        <p>{{ select.text.slice(0, 29) }}</p>
      </div>
    </div>
    <span class="material-symbols-outlined" @click="reset"> close </span>
  </div>
  <div class="hide-prev-input-borders-line"></div>
</template>

<script>
import store from "@/store/store";
import SmallChatImage from "../../SmallChatImage.vue";

export default {
  props: {
    selected: Boolean,
    required: true,
  },
  components: { SmallChatImage },
  methods: {
    reset() {
      store.commit("message/setReplyMsgRef", null);
      store.commit("message/setReplyTarget", null);
      store.commit("message/setForwardTarget", null);
    },
    scrllToTarget() {
      if (data.replyMsgRef) {
        this.$store.state.message.replyMsgRef.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
      }
    },
  },
  computed: {
    select() {
      if (this.$store.state.message.replyTarget) {
        return this.$store.state.message.replyTarget;
      } else if (this.$store.state.message.forwardTarget) {
        return this.$store.state.message.forwardTarget;
      }
      return false;
    },
  },
  mounted() {
    const chatRef = this.$store.state.chatAdditionalDataManage.chatContainerRef;
    const msgsListWay =
    this.$store.state.chatAdditionalDataManage.chatScrollWayRef;


    const space = this.$refs.replyBlock.clientHeight;

    if ((msgsListWay.clientHeight + 80) >= chatRef.clientHeight) {
      chatRef.style.transform = `translateY(${-space}px)`;
    }
  },
  beforeUnmount() {
    const chatRef = this.$store.state.chatAdditionalDataManage.chatContainerRef;
    chatRef.style.transform = `translateY(${0}px)`;
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors";

.video-prew {
  width: 40px;
  height: 40px;
}

.hide-prev-input-borders-line {
  width: 100%;
  background-color: $content-main-dark;
  height: 30px;
  bottom: -15px;
  z-index: 0;
  position: absolute;
}

.dark .hide-prev-input-borders-line {
  background-color: $content-main-l;
}

.conetent {
  border-radius: 20px 20px 0px 0px;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
  cursor: pointer;
  padding: 0px 10px 0px 10px;
  right: 0%;
  position: absolute;
  z-index: 10;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: $content-main-dark;
  height: 100%;
}

.dark .conetent {
  background-color: $content-main-l;
}

span {
  width: 35px;
  height: 35px;
  overflow: hidden;
  flex-shrink: 0;
  cursor: pointer;
  color: $second;
}

.dark span {
  color: $main-l;
}

.target-info {
  display: flex;
  justify-content: start;
  flex-direction: row;
  max-width: 100%;
  align-items: start;

  .text-container {
    text-align: left;
    display: flex;
    flex-direction: column;
    margin-left: 10px;

    h3 {
      font-weight: 550;
      font-size: 1rem;
      color: $second;
    }

    p {
      font-weight: 500;
      font-size: 0.8rem;
      color: $text-main;
    }
  }
}

.dark .text-container h3 {
  color: $main-l;
}

.dark .content {
  .text-container {
    p {
      color: $text-main-l;
    }
  }
}
</style>
