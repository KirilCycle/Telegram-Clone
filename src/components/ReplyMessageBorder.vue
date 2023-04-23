<template>
  <div  class="rep-container">
    <div @click="scrllToTarget" class="target-info">
      <span class="material-symbols-outlined"> reply </span>

      <div>
        <small-chat-image :type="select.source?.type" :src="select.source.src"></small-chat-image>
      
      </div>
      <div class="text-container">
        <h3>{{ select.from  || select.sender.userName}}</h3>
        <p>{{ select.text.slice(0, 29) }}</p>
      </div>
    </div>
    <span class="material-symbols-outlined" @click="reset"> close </span>
  </div>
</template>

<script>
import store from "@/store/store";
import SmallChatImage from "./SmallChatImage.vue";



export default {
  props: {
    selected: Object,
    required: true,
  },
  components: { SmallChatImage },
  data() {
    return {
      data: this.selected,
    };
  },
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
        
        console.log(this.$store.state.message.replyTarget.source, 'REP');
        return this.$store.state.message.replyTarget;
      } else if (this.$store.state.message.forwardTarget) {
        
        console.log(this.$store.state.message.forwardTarget.source, 'FOR');
        return this.$store.state.message.forwardTarget;
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors";

.video-prew {
  width: 40px;
  height: 40px;
}
.rep-container {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */

  cursor: pointer;
  padding: 0px 10px 0px 1px;
  right: 0%;
  position: absolute;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;



  span {
    width: 35px;
    height: 35px;
    overflow: hidden;
    flex-shrink: 0;
    cursor: pointer;
    color: $second;
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
}

.dark .rep-container {
  background-color: $content-main-l;
  .text-container {
    p {
      color: $text-main-l;
    }
  }
}
</style>
