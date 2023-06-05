<template>
  <div class="new-chat">
    <div class="send-hi-aler-wrap">
      <p>
        {{ text }}
      </p>

      <div class="img-wrap" @click="sayHi">
        <img
          src="https://cdn-icons-png.flaticon.com/512/6122/6122948.png"
          alt="hi text"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ChatInput from "./chat-input-components/ChatInput.vue";

export default {
  components: {
    ChatInput,
  },
  props: {
    sendMessageToFoundedChat: Function,
  },
  methods: {
    sayHi() {
      this.sendMessageToFoundedChat('Hi',this.$store.state.chat.selectedUser.uid )
    },
  },
  computed: {
    text() {
      return `This is start of your legendary conversation with ${
        this.$store.state.chat.selectedUser.displayName
          ? this.$store.state.chat.selectedUser.displayName
          : this.$store.state.chat.selectedUser.username
      } you can say Hi`;
    },
  },
};
</script>

<style lang="scss" scoped>
.new-chat {
  padding-top: 170px;

  h2 {
    color: #393939;
  }
}

.send-hi-aler-wrap {
  width: 240px;
  border-radius: 20px;
  height: 240px;
  position: absolute;
  padding: 20px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #5a58583e;
  backdrop-filter: blur(10px);
  color: white;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

  .img-wrap {
    min-width: 100%;
    height: 100px;

    img {
      cursor: pointer;
      max-width: 65%;
      height: auto;
      transition: transform 0.3s ease;
    }
    img:hover {
      transform: scale(1.2);
    }
  }
}
</style>
