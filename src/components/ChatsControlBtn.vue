<template>
  <main-button @click="v = !v" class="control">
      <optiosn-list-vue
        class="chat-controll-actions-list"
        v-if="v"
        :optionsList="options"
      ></optiosn-list-vue>

      <span v-show="!v" class="material-symbols-outlined"> edit </span>
      <span v-show="v" class="material-symbols-outlined"> close </span>
  </main-button>
</template>

<script>
import store from "@/store/store";
import OptiosnListVue from "./UI/lists/OptiosnList.vue";

export default {
  props: {
    inputRef: Object,
  },
  components: {
    OptiosnListVue,
  },
  data() {
    return {
      v: false,
      options: [
        {
          execute: this.newChatSearchOpen,
          htmlIcoEl: `<span class="material-symbols-outlined"> chat </span>`,
          description: "New chat",
        },
      ],
    };
  },
  methods: {
    newChatSearchOpen() {
      store.commit("chat/setQuery", "@");
      this.$emit("globalInvoke");
      this.inputRef.focus();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
.control {
  cursor: pointer;
  width: 55px;
  height: 55px;
  border-radius: 27.5px;
  display: flex;
  margin: 0% auto;
  justify-content: center;
  align-items: center;
  background-color: $second;

  &:hover {
    background-color: $main;
  }

  .chat-controll-actions-list {
    width: 200px;
    padding: 9px 2px 9px 2px;
    position: absolute;
    border-radius: 10px;
    bottom: 60px;
    right: 0px;
    list-style: none;
  }

  span {
    color: white;
    font-size: 1.8rem;
  }
}

.detect-content-leave {
  width: 250px;
  height: 250px;
  right: -20px;
  position: absolute;
  background-color: rgba(0, 0, 139, 0.355);
}
</style>
