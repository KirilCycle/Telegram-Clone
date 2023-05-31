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
    <!-- <img v-if="msg.source.type === 'img'" :src="msg.source.src" />
    <video class="video-player" v-else :src="msg.source.src"></video> -->
  
  </div>
  <div class="wrap-bottom" ref="inLoadingPreviewWrapBottom"></div>
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
  justify-content: end;
}

.in-loading-msg-preview {
  width: 250px;
  height: auto;
  max-height: 500px;
  position: relative;
  margin-left: 0%;
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
