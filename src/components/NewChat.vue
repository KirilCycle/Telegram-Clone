<template>
  <div class="new-chat">
    <h2>
      {{
        `This is start of your legendary conversation with ${
          $store.state.chat.selectedUser.displayName
            ? $store.state.chat.selectedUser.displayName
            : $store.state.chat.selectedUser.email
        }`
      }}
    </h2>
  </div>
</template>

<script>
import ChatInput from "./ChatInput.vue";




export default {
  components: {
    ChatInput,
  },
  data() {
    return {};
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
</style>
