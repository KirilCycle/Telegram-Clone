<template>
  <div class="wrap">
    <div
      v-for="msg in $store.state.previewChat.msgs"
      :key="msg.id"
      class="in-loading-msg-preview"
      v-show="msg.chatId === $store.state.chat.chatId"
    >
      <div class="loading-data-content-wrp">
        <close-spiner-vue @click="msg.cancel"></close-spiner-vue>
      </div>

      <message-source-container-vue :source="msg.source">
      </message-source-container-vue>
    </div>
  </div>
</template>

<script>
import store from "@/store/store";
import MessageSourceContainerVue from "./MessageSourceContainer.vue";
import CloseSpinerVue from "../UI/CloseSpiner.vue";

export default {
  components: {
    MessageSourceContainerVue,
    CloseSpinerVue,
  },
  data() {
    return {};
  },
  setup(props) {},
};
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  display: flex;
  right: 0px;
  flex-direction: column;
  align-items: flex-end;
}

.in-loading-msg-preview {
  width: 100%;
  max-width: 380px;
  width: max-content;
  position: relative;
  height: 400px;
  margin-top: 3px;
  border-radius: 20px;
  margin-left: 0%;
  position: relative;
}



.loading-data-content-wrp {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
  border-radius: 10px;
  backdrop-filter: blur(15px);
  display: flex;
  justify-content: center;
  align-items: center;
}

img {
  border-radius: 10px;
  width: 100%;
  max-height: 500px;
}

video {
  max-height: 500px;
  border-radius: 10px;
  width: 100%;
}
</style>
